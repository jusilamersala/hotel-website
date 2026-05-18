<?php
require __DIR__ . '/../../vendor/phpmailer/phpmailer/src/Exception.php';
require __DIR__ . '/../../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require __DIR__ . '/../../vendor/phpmailer/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {
    public static function sendVerificationEmail($toMail, $token) {
        $mail = new PHPMailer(true);

        try {
            // --- KONFIGURIMI I SERVERIT ---
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'grandhorizonh@gmail.com';
            $mail->Password   = 'xdya pzea zeno hgnn';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;
            $mail->CharSet    = 'UTF-8';

            // --- ZGJIDHJA PËR SSL NË LOCALHOST
            // Kjo lejon dërgimin edhe nëse PHP nuk ka certifikata të vlefshme në Windows
            /*$mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );*/

            $mail->setFrom('grandhorizonh@gmail.com', 'Grand Horizon Hotel');
            $mail->addAddress($toMail);

            $mail->isHTML(true);
            $mail->Subject = 'Konfirmimi i Regjistrimit - Grand Horizon';

            // URL-ja që do të klikojë përdoruesi.
            $confirmLink = "http://localhost:8000/api/users/confirmEmail.php?token=" . $token;

            $mail->Body = "
                <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
                    <h2>Mirësevini në Grand Horizon Hotel!</h2>
                    <p>Klikoni butonin e mëposhtëm për të aktivizuar llogarinë tuaj:</p>
                    <a href='$confirmLink' style='background: #d4af37; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;'>AKTIVIZO LLOGARINË</a>
                    <p style='margin-top: 20px; font-size: 12px; color: #777;'>Nëse keni nevojë për ndihmë mos hezitoni të na kontaktoni ne email,numër telefoni ose në faqen tonë web</p>
                </div>
            ";

            return $mail->send();
        } catch (Exception $e) {
            error_log("PHPMailer Error: " . $mail->ErrorInfo);
            return false;
        }
    }
}
