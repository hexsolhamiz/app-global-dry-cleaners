import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  washType?: 'mix' | 'separate';
}

interface BookingConfirmationEmailProps {
  // Address Information
  searchMode: 'postcode' | 'hotel' | 'address';
  postcode: string;
  selectedAddress: string;
  addressType: 'home' | 'office' | 'hotel';
  addressDetails: string;
  roomNumber?: string;
  hotelName?: string;

  // Collection Details
  collectionDay: string;
  collectionTime: string;
  collectionInstruction?: string;

  // Delivery Details
  deliveryDay: string;
  deliveryTime: string;
  deliveryInstruction?: string;
  driverNote?: string;
  frequency: string;

  // Services
  selectedServices: ServiceItem[];
  totalPrice: number;

  // Contact Information
  contactType: 'individual' | 'company';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName?: string;
  taxNumber?: string;

  // Booking Reference
  bookingReference?: string;
}

export const BookingConfirmationEmail = ({
  searchMode,
  postcode,
  selectedAddress,
  addressType,
  addressDetails,
  roomNumber,
  hotelName,
  collectionDay,
  collectionTime,
  collectionInstruction,
  deliveryDay,
  deliveryTime,
  deliveryInstruction,
  driverNote,
  frequency,
  selectedServices,
  totalPrice,
  contactType,
  firstName,
  lastName,
  phone,
  email,
  companyName,
  taxNumber,
  bookingReference = 'BOOK-' + Date.now(),
}: BookingConfirmationEmailProps) => {
  const previewText = `Booking Confirmation - ${bookingReference}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img
              src="https://res.cloudinary.com/dkgcww59b/image/upload/v1770738354/logo_bdxym6.webp"
              width="200"
              height="60"
              alt="Company Logo"
              style={logo}
            />
          </Section>

          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Booking Confirmation</Heading>
            <Text style={bookingRef}>Reference: {bookingReference}</Text>
          </Section>

          <Hr style={hr} />

          {/* Customer Information */}
          <Section style={section}>
            <Heading style={h2}>Customer Information</Heading>
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Type:</Text>
              </Column>
              <Column>
                <Text style={value}>
                  {contactType === 'individual' ? 'Individual' : 'Company'}
                </Text>
              </Column>
            </Row>

            {contactType === 'company' && companyName && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Company Name:</Text>
                </Column>
                <Column>
                  <Text style={value}>{companyName}</Text>
                </Column>
              </Row>
            )}

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Name:</Text>
              </Column>
              <Column>
                <Text style={value}>
                  {firstName} {lastName}
                </Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Email:</Text>
              </Column>
              <Column>
                <Text style={value}>{email}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Phone:</Text>
              </Column>
              <Column>
                <Text style={value}>{phone}</Text>
              </Column>
            </Row>

            {contactType === 'company' && taxNumber && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Tax Number:</Text>
                </Column>
                <Column>
                  <Text style={value}>{taxNumber}</Text>
                </Column>
              </Row>
            )}
          </Section>

          <Hr style={hr} />

          {/* Address Information */}
          <Section style={section}>
            <Heading style={h2}>Service Address</Heading>
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Address Type:</Text>
              </Column>
              <Column>
                <Text style={value}>
                  {addressType.charAt(0).toUpperCase() + addressType.slice(1)}
                </Text>
              </Column>
            </Row>

            {addressType === 'hotel' && hotelName && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Hotel Name:</Text>
                </Column>
                <Column>
                  <Text style={value}>{hotelName}</Text>
                </Column>
              </Row>
            )}

            {addressType === 'hotel' && roomNumber && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Room Number:</Text>
                </Column>
                <Column>
                  <Text style={value}>{roomNumber}</Text>
                </Column>
              </Row>
            )}

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Postcode:</Text>
              </Column>
              <Column>
                <Text style={value}>{postcode}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Address:</Text>
              </Column>
              <Column>
                <Text style={value}>{selectedAddress}</Text>
              </Column>
            </Row>

            {addressDetails && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Details:</Text>
                </Column>
                <Column>
                  <Text style={value}>{addressDetails}</Text>
                </Column>
              </Row>
            )}
          </Section>

          <Hr style={hr} />

          {/* Collection Details */}
          <Section style={section}>
            <Heading style={h2}>Collection Details</Heading>
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Date:</Text>
              </Column>
              <Column>
                <Text style={value}>{collectionDay}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Time:</Text>
              </Column>
              <Column>
                <Text style={value}>{collectionTime}</Text>
              </Column>
            </Row>

            {collectionInstruction && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Instructions:</Text>
                </Column>
                <Column>
                  <Text style={value}>{collectionInstruction}</Text>
                </Column>
              </Row>
            )}
          </Section>

          <Hr style={hr} />

          {/* Delivery Details */}
          <Section style={section}>
            <Heading style={h2}>Delivery Details</Heading>
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Date:</Text>
              </Column>
              <Column>
                <Text style={value}>{deliveryDay}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Time:</Text>
              </Column>
              <Column>
                <Text style={value}>{deliveryTime}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>Frequency:</Text>
              </Column>
              <Column>
                <Text style={value}>
                  {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                </Text>
              </Column>
            </Row>

            {deliveryInstruction && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Instructions:</Text>
                </Column>
                <Column>
                  <Text style={value}>{deliveryInstruction}</Text>
                </Column>
              </Row>
            )}

            {driverNote && (
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Driver Note:</Text>
                </Column>
                <Column>
                  <Text style={value}>{driverNote}</Text>
                </Column>
              </Row>
            )}
          </Section>

          <Hr style={hr} />

          {/* Services Ordered */}
          <Section style={section}>
            <Heading style={h2}>Services Ordered</Heading>
            {selectedServices.map((service, index) => (
              <Row key={service.id} style={serviceRow}>
                <Column style={{ width: '60%' }}>
                  <Text style={serviceName}>
                    {service.name}
                    {service.washType && (
                      <span style={washType}>
                        {' '}
                        ({service.washType === 'mix' ? 'Mixed' : 'Separate'})
                      </span>
                    )}
                  </Text>
                </Column>
                <Column style={{ width: '40%', textAlign: 'right' }}>
                  <Text style={servicePrice}>£{service.price.toFixed(2)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={subtleHr} />

            <Row style={totalRow}>
              <Column style={{ width: '60%' }}>
                <Text style={totalLabel}>Total Amount:</Text>
              </Column>
              <Column style={{ width: '40%', textAlign: 'right' }}>
                <Text style={totalAmount}>£{totalPrice.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Thank you for choosing our laundry service! If you have any questions
              about your booking, please don&apos;t hesitate to contact us.
            </Text>
            <Text style={footerText}>
              This is an automated confirmation email. Please do not reply directly to
              this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#ffffff',
};

const logo = {
  margin: '0 auto',
};

const header = {
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 12px',
  padding: '0',
  lineHeight: '1.3',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
  padding: '0',
};

const bookingRef = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
  padding: '0',
};

const section = {
  padding: '24px 40px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '0',
};

const subtleHr = {
  borderColor: '#e6ebf1',
  margin: '16px 0',
};

const infoRow = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '35%',
  verticalAlign: 'top' as const,
};

const label = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  padding: '0',
};

const value = {
  color: '#1a1a1a',
  fontSize: '14px',
  margin: '0',
  padding: '0',
  lineHeight: '1.5',
};

const serviceRow = {
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f6f9fc',
};

const serviceName = {
  color: '#1a1a1a',
  fontSize: '14px',
  margin: '0',
  padding: '0',
};

const washType = {
  color: '#666',
  fontSize: '13px',
  fontStyle: 'italic' as const,
};

const servicePrice = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  padding: '0',
};

const totalRow = {
  marginTop: '16px',
  paddingTop: '16px',
};

const totalLabel = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
};

const totalAmount = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
};

const footer = {
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '8px 0',
};