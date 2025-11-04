import { jest } from '@jest/globals';

const mockDbConnect = jest.fn(() => ({ 
  on: jest.fn(),
  once: jest.fn(),
}));

jest.unstable_mockModule('./dbConnect.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    on: jest.fn(),
    once: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  })),
}));

jest.unstable_mockModule('../models/Livro.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const { default: app } = await import('../app.js');
const { default: livro } = await import('../models/Livro.js');
const { default: dbConnect } = await import('../config/dbConnect.js');

import request from 'supertest';

jest.mock('./dbConnect.js', () => ({ 
  __esModule: true,
  default: jest.fn(async () => ({
    on: jest.fn(),
    once: jest.fn(),
    close: jest.fn() 
  }))
}));

jest.mock('../models/Livro.js', () => ({ //simula o modelo Livro
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn()
  }
}));

describe('API tests - src/app.js', () => {
  beforeEach(() => {
    if (livro.find && livro.find.mockReset) livro.find.mockReset();
    if (livro.create && livro.create.mockReset) livro.create.mockReset();
  });

  test('dbConnect is called and event handlers are attached', async () => {
    expect(dbConnect).toHaveBeenCalled();
    const conectPromise = dbConnect.mock.results[0].value;
    const conect = await conectPromise;
    expect(conect).toHaveProperty('on');
    expect(conect).toHaveProperty('once');
    expect(conect.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(conect.once).toHaveBeenCalledWith('open', expect.any(Function));
  });

  test('GET / should return welcome text', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('API em Node.js com Express e mongoose V.1.0');
  });

  test('GET /livros returns 200 and list when livros exist and calls find.exec', async () => {
    const sample = [{ titulo: 'Livro A', autor: 'Autor A' }];
    const execMock = jest.fn().mockResolvedValue(sample);
    livro.find.mockImplementation(() => ({ exec: execMock }));

    const res = await request(app).get('/livros');

    expect(livro.find).toHaveBeenCalled();
    expect(execMock).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(sample);
  });

  test('GET /livros returns 404 when no livros found', async () => {
    livro.find.mockImplementation(() => ({ exec: jest.fn().mockResolvedValue([]) }));

    const res = await request(app).get('/livros');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Nenhum livro encontrado');
  });

  test('GET /livros returns 500 when find.exec rejects', async () => {
    livro.find.mockImplementation(() => ({ exec: jest.fn().mockRejectedValue(new Error('fail')) }));

    const res = await request(app).get('/livros');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'fail' });
  });

  test('POST /add_livros creates a new livro and returns 201 and calls create with body', async () => {
    const novo = { titulo: 'Novo', autor: 'X' };
    livro.create.mockResolvedValue(novo);

    const res = await request(app)
      .post('/add_livros')
      .send(novo)
      .set('Accept', 'application/json');

    expect(livro.create).toHaveBeenCalledWith(novo);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(novo);
  });

  test('POST /add_livros returns 500 when create fails', async () => {
    livro.create.mockRejectedValue(new Error('db error'));

    const res = await request(app).post('/add_livros').send({ titulo: 'Err' });
    expect(livro.create).toHaveBeenCalled();
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Erro ao adicionar livro' });
  });

  afterAll(async () => {
    // fecha a conexão mockada caso exista
    if (dbConnect && dbConnect.mock && dbConnect.mock.results.length) {
      const conectPromise = dbConnect.mock.results[0].value;
      if (conectPromise && typeof conectPromise.then === 'function') {
        const conect = await conectPromise;
        if (conect && typeof conect.close === 'function') {
          conect.close();
        }
      }
    }
    jest.restoreAllMocks();
  });
});