import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import BookingConfirmationEmail from '@/emails/booking-confirmation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      // Address Information
      searchMode,
      postcode,
      selectedAddress,
      addressType,
      addressDetails,
      roomNumber,
      hotelName,
      
      // Collection Details
      collectionDay,
      collectionTime,
      collectionInstruction,
      
      // Delivery Details
      deliveryDay,
      deliveryTime,
      deliveryInstruction,
      driverNote,
      frequency,
      
      // Services
      selectedServices,
      
      // Contact Information
      contactType,
      firstName,
      lastName,
      phone,
      email,
      companyName,
      taxNumber,
    } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      );
    }

    if (!selectedServices || selectedServices.length === 0) {
      return NextResponse.json(
        { error: 'No services selected' },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = selectedServices.reduce(
      (sum: number, service: any) => sum + service.price,
      0
    );

    // Generate booking reference
    const bookingReference = `BOOK-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Send email to customer
    const { data: customerData, error: customerError } = await resend.emails.send({
      from: 'info@globaldrycleaners.co.uk',
      to: 'info@globaldrycleaners.co.uk',
      subject: `Booking Confirmation - ${bookingReference}`,
      react: BookingConfirmationEmail({
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
          bookingReference
      }),
    });

    if (customerError) {
      console.error('Error sending customer email:', customerError);
      return NextResponse.json(
        { error: 'Failed to send confirmation email', details: customerError },
        { status: 500 }
      );
    }


    return NextResponse.json({
      success: true,
      bookingReference,
      customerEmailId: customerData?.id,
      message: 'Booking confirmation sent successfully',
    });
  } catch (error) {
    console.error('Error processing booking email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}