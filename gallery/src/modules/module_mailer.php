<?php

require_once 'module_abstract.php';
require_once 'phpmailer/class.phpmailer.php';

class Module_mailer extends Module_abstract
{
  /**
   @vars: template_form, template_sent, from, fromname, to, toname, message, spamfilter, host
   */
  public function execute()
  {
    if ($this->message)
    {
      if (!$this->fromname || !$this->from)
      {
        $error = "Proszę wypełnić wszystkie pola";
      }
      else if (mb_substr(trim($this->message), 0, 36, 'utf-8') != 'Bardzo mi się podobają Twoje zdjęcia')
      {
        $error = "Filtr antyspamowy - aby wiadomość została wysłana musi zawierać na początku zdanie \"Bardzo mi się podobają Twoje zdjęcia\"";
      }
      else
      {
        $mail = new PHPMailer();
        $mail->SetLanguage('pl');
        $mail->CharSet = 'UTF-8';
        
        $mail->Mailer = "smtp";
        $mail->SMTPAuth = true;
        $mail->Host = $this->host;
        $mail->Port = 25;
        $mail->Username = $this->username;
        $mail->Password = $this->password;
        
        $mail->From = $this->to;
        $mail->FromName = $this->fromname;
        $mail->AddAddress($this->to, $this->toname);
        $mail->Subject = "Message z karczmarczyk.pl";
        $mail->Body = $this->message."\n\nReply-To: \"{$this->fromname}\" <{$this->from}>";
        
        $state = $mail->Send() ? 'sent' : 'error';
        $error = $mail->ErrorInfo;
      }
    }
    else
    {
      $state = 'form';
      $this->message = "Bardzo mi się podobają Twoje zdjęcia.\n\n";
    }
  
    $tal = new PHPTAL($state == 'sent' ? $this->template_sent : $this->template_form);
    $tal->set('action', $_SERVER['REQUEST_URI']);
    $tal->set('from', $this->from);
    $tal->set('fromname', $this->fromname);
    $tal->set('message', $this->message);
    $tal->set('error', $error);

    return $tal->execute();
  }
}