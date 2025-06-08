import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, TextField, IconButton, Card, Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { Send, Close } from '@mui/icons-material';

// Zod validation schema for email input
const emailInputSchema = z.object({
  emailInput: z.string().min(1, 'At least one email is required'),
});

// Improved validation function with better error handling
const validateSingleEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.includes('@')) {
    return { isValid: false, error: 'Email must contain @ symbol' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Email must contain exactly one @ symbol' };
  }

  const [localPart, domainPart] = parts;

  if (!localPart) {
    return { isValid: false, error: 'Email must have text before @ symbol' };
  }

  if (!domainPart) {
    return { isValid: false, error: 'Email must have domain after @ symbol' };
  }

  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Domain must contain a dot (like .com)' };
  }

  // More comprehensive regex for email validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

const validateAndParseEmails = (input: string): { validEmails: string[]; errors: string[] } => {
  const emails = input
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  if (emails.length === 0) {
    return { validEmails: [], errors: ['At least one email is required'] };
  }

  if (emails.length > 20) {
    return { validEmails: [], errors: ['Maximum 20 emails allowed'] };
  }

  const errors: string[] = [];
  const validEmails: string[] = [];

  emails.forEach((email) => {
    const validation = validateSingleEmail(email);
    if (validation.isValid) {
      validEmails.push(email);
    } else {
      errors.push(`"${email}": ${validation.error}`);
    }
  });

  return { validEmails, errors };
};

type EmailInputFormData = z.infer<typeof emailInputSchema>;

// Email Input Component with React Hook Form and Zod
interface EmailInputProps {
  emails: string[];
  setEmails: (emails: string[]) => void;
  onSendEmails: () => void;
  isSending: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ emails, setEmails, onSendEmails, isSending }) => {
  const [duplicateMessage, setDuplicateMessage] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [shouldSend, setShouldSend] = useState(false);

  const emailForm = useForm<EmailInputFormData>({
    resolver: zodResolver(emailInputSchema),
    defaultValues: {
      emailInput: '',
    },
  });

  // Use effect to send emails after state updates
  useEffect(() => {
    if (shouldSend) {
      setShouldSend(false);
      onSendEmails();
    }
  }, [emails, shouldSend, onSendEmails]);

  const handleSendEmails = () => {
    // Get current input value
    const currentInput = emailForm.getValues('emailInput');

    // Clear previous validation errors
    setValidationErrors([]);

    // If there's text in the input, validate and add those emails first
    if (currentInput?.trim()) {
      const { validEmails, errors } = validateAndParseEmails(currentInput);

      // If there are validation errors, display them and return early
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      // Filter out duplicates
      const newEmails = validEmails.filter((email) => !emails.includes(email));
      const allEmails = [...emails, ...newEmails];

      // Update emails list and clear input
      setEmails(allEmails);
      emailForm.reset();

      // Show info about duplicates if any
      const duplicates = validEmails.filter((email) => emails.includes(email));
      if (duplicates.length > 0) {
        setDuplicateMessage(
          `Added ${newEmails.length} new email${newEmails.length !== 1 ? 's' : ''}, skipped ${duplicates.length} duplicate${duplicates.length !== 1 ? 's' : ''}`,
        );
        setTimeout(() => setDuplicateMessage(''), 3000);
      }

      // Set flag to send emails after state update
      setShouldSend(true);
    } else if (emails.length > 0) {
      // If no new input but there are existing emails, just send
      onSendEmails();
    } else {
      // No emails at all
      setValidationErrors(['Please enter at least one email address']);
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  // Clear validation errors when user starts typing
  const handleInputChange = (value: string) => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    return value;
  };

  return (
    <Stack spacing={3}>
      {/* Email Input */}
      <Box>
        <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 2 }}>
          Add Email Recipients
        </Typography>

        <Box>
          <Controller
            name="emailInput"
            control={emailForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                onChange={(e) => {
                  const value = handleInputChange(e.target.value);
                  field.onChange(value);
                }}
                fullWidth
                multiline
                rows={2}
                placeholder="Enter email addresses separated by commas (e.g., john@example.com, jane@example.com)"
                error={!!fieldState.error || validationErrors.length > 0}
                helperText={
                  fieldState.error?.message ||
                  (validationErrors.length > 0
                    ? null
                    : 'You can enter a single email or multiple emails separated by commas')
                }
                size="small"
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Custom validation errors display */}
          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', mb: validationErrors.length > 1 ? 1 : 0 }}>
                {validationErrors.length === 1 ? 'Email Error:' : 'Email Errors:'}
              </Typography>
              {validationErrors.map((error, index) => (
                <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem' }}>
                  • {error}
                </Typography>
              ))}
            </Alert>
          )}
        </Box>
      </Box>

      {/* Email List */}
      {emails.length > 0 && (
        <Box>
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
            Recipients ({emails.length}):
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            <Stack spacing={1}>
              {emails.map((email, index) => (
                <Card key={index} sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{email}</Typography>
                    <IconButton size="small" onClick={() => removeEmail(email)} sx={{ color: 'error.main' }}>
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Box>
        </Box>
      )}

      {/* Send Emails Button */}
      <Button
        variant="contained"
        color="primary"
        disabled={isSending || (!emailForm.watch('emailInput')?.trim() && emails.length === 0)}
        fullWidth
        onClick={handleSendEmails}
        startIcon={isSending ? <CircularProgress size={16} /> : <Send />}
      >
        {isSending
          ? `Sending to ${
              emails.length +
              (emailForm
                .watch('emailInput')
                ?.split(',')
                .filter((e) => e.trim()).length || 0)
            } recipient${
              emails.length +
                (emailForm
                  .watch('emailInput')
                  ?.split(',')
                  .filter((e) => e.trim()).length || 0) >
              1
                ? 's'
                : ''
            }...`
          : `Send Email to ${
              emails.length +
              (emailForm
                .watch('emailInput')
                ?.split(',')
                .filter((e) => e.trim()).length || 0)
            } recipient${
              emails.length +
                (emailForm
                  .watch('emailInput')
                  ?.split(',')
                  .filter((e) => e.trim()).length || 0) >
              1
                ? 's'
                : ''
            }`}
      </Button>

      {/* Clear All Button */}
      {emails.length > 0 && (
        <Button variant="outlined" color="error" size="small" onClick={() => setEmails([])}>
          Clear All ({emails.length})
        </Button>
      )}

      {/* Duplicate Message */}
      {duplicateMessage && (
        <Alert severity="info">
          <Typography variant="body2">{duplicateMessage}</Typography>
        </Alert>
      )}
    </Stack>
  );
};
