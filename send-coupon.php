<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Adjust path if needed

header('Content-Type: application/json');

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get recipient email
    $recipient = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    
    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please provide a valid email address']);
        exit;
    }
    
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Change to your SMTP host
        $mail->SMTPAuth = true;
        $mail->Username = 'kevinsalinas408@gmail.com'; // Change to your email
        $mail->Password = 'ncaosgxuvwotyyki'; // Change to your password or app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Recipients
        $mail->setFrom('kevinsalinas408@gmail.com', 'Surprise Coupon'); // Change to your email
        $mail->addAddress($recipient);  
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "Here's a MarieBean Coupon for You!";
        
        // Email body with coupon HTML
        $mail->Body = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #e75480; text-align: center;">Your Special Love Coupon</h1>
            
            <div style="background-color: #fff; border: 2px dashed #ff85a2; border-radius: 15px; padding: 30px; text-align: center; margin: 20px 0;">
                <h2 style="font-family: cursive; color: #e75480;">MarieBean Coupon</h2>
                <p style="color: #8b5d77;">This coupon entitles you to:</p>
                <h3 style="font-family: cursive; color: #ff85a2; font-size: 24px; margin: 20px 0;">Unlimited Special Date Night</h3>
                <p style="font-style: italic; font-size: 14px; color: #8b5d77;">Redeemable anytime. No expiration.</p>
                <p><img src="cid:mariepixel" alt="marie" style="height: 20px; vertical-align: middle;"> <style="color: #8b5d77; margin-top: 15px;">Just present your screenshot anytime <img src="cid:mariepixel" alt="marie" style="height: 20px; vertical-align: middle;"></p>
                <p style="font-family: cursive; font-size: 18px; color: #e75480; margin-top: 25px;">Use this for special occasions (Example: Movie Night or Game Night)</p>
            </div>
            
            <p style="text-align: center; color: #666;">This coupon was sent to you by someone who cares about you very much.</p>
        </div>
        ';
        
        // Add the embedded image
        $mail->addEmbeddedImage('/home/kevin/Desktop/valentines-template/mariepixel.png', 'mariepixel', 'mariepixel.png');

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Coupon sent successfully!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Could not send the email: ' . $mail->ErrorInfo]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>