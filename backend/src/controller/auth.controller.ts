import { Request, Response } from 'express';
import bycryptjs from 'bcryptjs';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

import { User } from '../entity/user.entity';
import source from '../ormconfig';
import { TypedRequestBody } from '../interfaces';

interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const Register = async (
  req: TypedRequestBody<RegisterRequest>,
  res: Response
) => {
  const body = req.body;

  if (!body.first_name || !body.last_name || !body.email || !body.password) {
    return res
      .status(400)
      .send({ message: 'There is a problem with the parameters' });
  }

  const user = await source.getRepository(User).findOne({
    where: {
      email: body.email,
    },
  });

  //　該当のメールアドレスに対応するデータが存在する場合、すでに登録されている旨のレスポンスを返却
  if (user) {
    return res.status(400).send('Email is already registered');
  } else {
    /// ユーザー情報の登録処理
    source.transaction(async (em) => {
      em.getRepository(User)
        .save({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          password: await bycryptjs.hash(body.password, 12),
        })
        .then(({ password, ...user }) => {
          return res.status(201).send(user);
        })
        .catch((err) => {
          if (err.code === 'ER_NO_DEFAULT_FOR_FIELD') {
            return res.status(400).send('Insert error');
          }
          return res
            .status(500)
            .send({ message: 'Failed to register', err: err });
        });
    });
  }
};

export const Login = async (
  req: TypedRequestBody<LoginRequest>,
  res: Response
) => {
  const body = req.body;

  if (!body.email || !body.password) {
    return res
      .status(400)
      .send({ message: 'There is a problem with the parameters' });
  }
  const user = await source.getRepository(User).findOne({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  if (!(await bycryptjs.compare(body.password, user.password))) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  const accessToken = sign(
    {
      id: user.id,
    },
    process.env.ACCESS_SECRET || '',
    { expiresIn: '30s' }
  );

  const refreshToken = sign(
    {
      id: user.id,
    },
    process.env.REFRESH_SECRET || '',
    { expiresIn: '1w' }
  );

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.send({
    message: 'Succress',
  });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;

    if (!('access_token' in cookies)) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const cookie = cookies['access_token'];
    const payload = verify(
      cookie,
      process.env.ACCESS_SECRET || ''
    ) as JwtPayload;

    if (!payload) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const user = await source.getRepository(User).findOne({
      where: { id: Number(payload.id) },
    });

    if (!user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const { password, ...data } = user;

    return res.status(200).send(data);
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

export const Refresh = (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!('refresh_token' in cookies)) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const cookie = cookies['refresh_token'];

    const payload = verify(
      cookie,
      process.env.REFRESH_SECRET || ''
    ) as JwtPayload;

    if (!payload) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const accessToken = sign(
      {
        id: payload.id,
      },
      process.env.ACCESS_SECRET ?? '',
      { expiresIn: '30s' }
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({ message: 'Seccess' });
  } catch (e) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

export const Status = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;

    if (!('access_token' in cookies)) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const cookie = cookies['access_token'];
    const payload = verify(
      cookie,
      process.env.ACCESS_SECRET || ''
    ) as JwtPayload;

    if (!payload) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const user = await source.getRepository(User).findOne({
      where: { id: Number(payload.id) },
    });

    if (!user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    return res.status(200).send({ result: true });
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

export const Logout = (req: Request, res: Response) => {
  res.cookie('access_token', '', { maxAge: 0 });
  res.cookie('refresh_token', '', { maxAge: 0 });

  return res.status(200).send({ message: 'Success' });
};
