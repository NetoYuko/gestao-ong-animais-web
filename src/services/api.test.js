import { api } from './api';
import MockAdapter from 'axios-mock-adapter';
import { STORAGE_KEYS } from '../utils/storageKeys';

describe('API Interceptors', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(api);
    localStorage.clear();
    delete window.location;
    window.location = { href: '' }; 
  });

  afterEach(() => {
    mock.restore();
  });

  it('deve adicionar o token no cabeçalho da requisição', async () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'meu_token_secreto');
    mock.onGet('/animais').reply(200);

    const response = await api.get('/animais');
    
    expect(response.config.headers.Authorization).toBe('Bearer meu_token_secreto');
  });

  it('deve forçar logout ao receber erro 401 da API', async () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token_expirado');
    mock.onGet('/animais').reply(401);

    try {
      await api.get('/animais');
    } catch (error) {
    }

    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(window.location.href).toBe('/login');
  });
});