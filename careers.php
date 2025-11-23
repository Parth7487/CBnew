<?php
    require("./mailing/mailfunction.php");

    $name = $_POST["name"];
    $phone = $_POST['phone'];
    $email = $_POST["email"];
    $applyfor = $_POST["status"];
    $experience = $_POST["experience"];
    $otherdetails = $_POST["details"];

    $filename = $_FILES["fileToUpload"]["name"];
	$filetype = $_FILES["fileToUpload"]["type"];
	$filesize = $_FILES["fileToUpload"]["size"];
	$tempfile = $_FILES["fileToUpload"]["tmp_name"];
	$filenameWithDirectory = "".$name.".pdf";

    $body = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;'>";
    $body .= "<h2 style='color: #002e5f;'>New Career Application</h2>";
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
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Apply For:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'>".$applyfor."</td>";
    $body .= "</tr>";
    $body .= "<tr style='background-color: #e8e8e8;'>";
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Experience:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'>".$experience." Years</td>";
    $body .= "</tr>";
    $body .= "<tr>";
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd; vertical-align: top;'>Additional Details:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'>".$otherdetails."</td>";
    $body .= "</tr>";
    $body .= "<tr style='background-color: #e8e8e8;'>";
    $body .= "<td style='padding: 10px; font-weight: bold; border: 1px solid #ddd;'>Resume:</td>";
    $body .= "<td style='padding: 10px; border: 1px solid #ddd;'>See attached file</td>";
    $body .= "</tr>";
    $body .= "</table>";
    $body .= "</div>";

	if(move_uploaded_file($tempfile, $filenameWithDirectory))
	{
		$status = mailfunction("Sale@cbgloble.in", "CB GLOBLE INDIA", $body, $filenameWithDirectory);
        if($status)
            echo '<center><h1 style="color: #00bfff; margin-top: 5rem;">Thank You for Applying!</h1><p style="font-size: 1.2rem; color: #333;">We have received your application and will contact you soon.</p></center>';
        else
            echo '<center><h1 style="color: #ff6b6b; margin-top: 5rem;">Error sending application!</h1><p style="font-size: 1.2rem; color: #333;">Please try again or contact us at Sale@cbgloble.in or +91 97244 00442</p></center>';
	}
	else
	{
		echo "<center><h1 style='color: #ff6b6b; margin-top: 5rem;'>Error uploading file!</h1><p style='font-size: 1.2rem; color: #333;'>Please try again.</p></center>";
	}

?>
