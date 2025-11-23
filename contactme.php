<?php
    require("./mailing/mailfunction.php");

    $name = $_POST["name"];
    $phone = $_POST['phone'];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $body = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;'>";
    $body .= "<h2 style='color: #002e5f;'>New Contact Form Submission</h2>";
    $body .= "<table style='width: 100%; border-collapse: collapse;'>";
    $body .= "<tr style='background-color: #e8e8e8;'>";
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Name:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'>".$name."</td>";
    $body .= "</tr>";
    $body .= "<tr>";
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Phone:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'>".$phone."</td>";
    $body .= "</tr>";
    $body .= "<tr style='background-color: #e8e8e8;'>";
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Email:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'><a href='mailto:".$email."'>".$email."</a></td>";
    $body .= "</tr>";
    $body .= "<tr>";
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd; vertical-align: top;'>Message:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'>".$message."</td>";
    $body .= "</tr>";
    $body .= "</table>";
    $body .= "</div>";

    // Send to company email
    $status = mailfunction("Sale@cbgloble.in", "CB GLOBLE INDIA", $body);

    if($status)
        echo '<center><h1 style="color: #00bfff; margin-top: 5rem;">Thank You! We will contact you soon.</h1><p style="font-size: 1.2rem; color: #333;">Your message has been received successfully.</p></center>';
    else
        echo '<center><h1 style="color: #ff6b6b; margin-top: 5rem;">Error sending message!</h1><p style="font-size: 1.2rem; color: #333;">Please try again or contact us at Sale@cbgloble.in or +91 97244 00442</p></center>';
?>
