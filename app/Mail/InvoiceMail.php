<?php

namespace App\Mail;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public Invoice $invoice;

    public bool $isUpdate;   // ← tambahkan flag

    /**
     * Create a new message instance.
     *
     * @param  bool  $isUpdate  apakah ini email update?
     */
    public function __construct(Invoice $invoice, bool $isUpdate = false)
    {
        $this->invoice = $invoice;
        $this->isUpdate = $isUpdate;    // ← set flag
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // tentukan label berdasarkan flag
        $label = $this->isUpdate ? 'Invoice (Updated)' : 'Invoice';
        $subject = "{$label} #{$this->invoice->invoice_number}";

        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name')
            ),
            subject: $subject,             // ← subject dinamis
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.invoices.invoice',
            with: [
                'invoice' => $this->invoice->load('klien'),
                'isUpdate' => $this->isUpdate,   // ← oper flag ke view
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $fileName = "invoice_{$this->invoice->invoice_number}.pdf";

        return [
            Attachment::fromStorageDisk(
                'invoices',
                $fileName
            )
                ->as($fileName)
                ->withMime('application/pdf'),
        ];
    }
}
