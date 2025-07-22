/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    async sendEmail(
        to: string,
        subject: string,
        params: { name: string; code: string },
    ): Promise<void> {
        // Load and compile the HTML template
        const templatePath = join(
            process.cwd(),
            'src',
            '@shared',
            'templates',
            'emails',
            'reset-password.html',
        );

        let html = readFileSync(templatePath, 'utf8');

        html = html
            .replace(/{{var.name}}/g, params.name)
            .replace(/{{var.resetLink}}/g, params.code);

        try {
            await this.transporter.sendMail({
                from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
                to,
                subject,
                html,
            });
        } catch (error) {
            console.error('Email send error:', error);
            throw error;
        }
    }
}
