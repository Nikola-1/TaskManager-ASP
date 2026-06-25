using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Modules.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modules.Implementation.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration) { 
                _configuration = configuration;
        }

        public async Task SendEmailAsync(
            string to,
            string subject,
            string body
            )
        {
            if (string.IsNullOrWhiteSpace(to))
            {
                throw new ArgumentException("Recipient email is required.");
            }
            var email = new MimeMessage();

            email.From.Add(
                new MailboxAddress(
                            _configuration["EmailSettings:SenderName"],
                            _configuration["EmailSettings:SenderEmail"]
                    )
                );
            email.To.Add(
    MailboxAddress.Parse(to)
);
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(

                _configuration["EmailSettings:SmtpServer"],
                 int.Parse(_configuration["EmailSettings:Port"]!),
            MailKit.Security.SecureSocketOptions.StartTls
                );
            await smtp.AuthenticateAsync(
           _configuration["EmailSettings:SenderEmail"],
           _configuration["EmailSettings:Password"]
       );

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);
        }
        
    }
}
