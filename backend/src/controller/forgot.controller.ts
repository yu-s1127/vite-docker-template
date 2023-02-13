import { Request, Response } from 'express';
import { createTransport } from 'nodemailer';
import { off } from 'process';
import bcryptjs from 'bcryptjs';

import { Reset } from '../entity/reset.entity';
import { User } from '../entity/user.entity';
import { TypedRequestBody } from '../interfaces';
import source from '../ormconfig';

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const ForgotPassword = async (
  req: TypedRequestBody<ForgotPasswordRequest>,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'There is no email address' });
  }
  const token = Math.random().toString(20).substring(2, 12);

  await source.getRepository(Reset).save({
    email,
    token,
  });

  const transport = createTransport({
    host: 'mailhog',
    port: 1025,
  });

  const url = `http://localhost:3000/reset/${token}`;

  await transport.sendMail({
    from: 'from@example.com',
    to: email,
    subject: 'Reset your password',
    html: `Click <a href="${url}">here</a> to reset your password!`,
  });

  res.send({ message: 'Please check your email' });
};

export const ResetPassword = async (
  req: TypedRequestBody<ResetPasswordRequest>,
  res: Response
) => {
  const body = req.body;

  if (!body.token || !body.password) {
    return res
      .status(400)
      .send({ message: 'There is a problem with the parameters' });
  }

  const resetPassword = await source
    .getRepository(Reset)
    .findOne({ where: { token: body.token } });

  if (!resetPassword) {
    return res.status(400).send({ message: 'Invalid link!' });
  }

  const user = await source.getRepository(User).findOne({
    where: {
      email: resetPassword.email,
    },
  });

  if (!user) {
    return res.status(404).send({ message: 'User not found!' });
  }

  try {
    source.transaction(async (em) => {
      em.getRepository(User).update(user.id, {
        password: await bcryptjs.hash(body.password, 12),
      });
    });
  } catch (err) {
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  return res.status(200).send({ message: 'Success' });
};