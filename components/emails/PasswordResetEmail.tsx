import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  resetLink: string;
}

const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your App password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Password Reset</Heading>
        <Text style={text}>Hi there,</Text>
        <Text style={text}>
          Someone requested a password reset for your app account. If this
          was you, click the link below to reset your password.
        </Text>
        <Link style={button} href={resetLink}>
          Reset Password
        </Link>
        <Text style={text}>
          If you didn't request this, you can safely ignore this email.
        </Text>
        <Text style={footer}>
          Best regards,
          <br />
          My App Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '50px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '200px',
  margin: '16px 0',
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '32px 0 0',
};

export default PasswordResetEmail;