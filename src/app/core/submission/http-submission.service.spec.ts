import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpSubmissionService } from './http-submission.service';
import { SUBMISSION_ENDPOINT, SubmissionError } from './submission.service';

const ENDPOINT = 'https://forms.example.test/submit/abc';
const ANSWERS = { patientFirst: 'Sam', description: 'A scar on my arm.' };

function setup(endpoint: string) {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: SUBMISSION_ENDPOINT, useValue: endpoint },
    ],
  });
  return {
    service: TestBed.inject(HttpSubmissionService),
    http: TestBed.inject(HttpTestingController),
  };
}

describe('HttpSubmissionService', () => {
  it('is not live and sends nothing while no endpoint is set', async () => {
    const { service, http } = setup('');
    expect(service.live).toBe(false);
    await expect(service.submit('request', ANSWERS)).resolves.toBe('demo');
    http.expectNone(() => true);
  });

  it('is live once an endpoint is set', () => {
    expect(setup(ENDPOINT).service.live).toBe(true);
  });

  it('posts plain JSON to the endpoint, with the answers in the body only', async () => {
    const { service, http } = setup(ENDPOINT);
    const result = service.submit('request', ANSWERS);
    const req = http.expectOne(ENDPOINT);
    expect(req.request.method).toBe('POST');
    expect(req.request.url).not.toContain('Sam');
    expect(req.request.params.keys()).toEqual([]);
    expect(req.request.withCredentials).toBe(false);
    expect(req.request.body).toEqual({ form: 'request', fields: ANSWERS });
    req.flush(null, { status: 201, statusText: 'Created' });
    await expect(result).resolves.toBe('sent');
  });

  it('rejects with a reason and none of the answers when the service refuses', async () => {
    const { service, http } = setup(ENDPOINT);
    const result = service.submit('request', ANSWERS);
    http.expectOne(ENDPOINT).flush({ echo: 'Sam' }, { status: 500, statusText: 'Server Error' });
    const error = await result.catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SubmissionError);
    expect((error as SubmissionError).reason).toBe('server');
    expect(JSON.stringify(error)).not.toContain('Sam');
    expect((error as SubmissionError).message).not.toContain('Sam');
  });

  it('rejects with a network reason when the connection fails', async () => {
    const { service, http } = setup(ENDPOINT);
    const result = service.submit('request', ANSWERS);
    http.expectOne(ENDPOINT).error(new ProgressEvent('error'));
    await expect(result).rejects.toMatchObject({ reason: 'network' });
  });

  it('refuses to post answers over an insecure address', async () => {
    const { service, http } = setup('http://forms.example.test/submit');
    await expect(service.submit('request', ANSWERS)).rejects.toMatchObject({
      reason: 'insecure',
    });
    http.expectNone(() => true);
  });

  it('writes nothing to the console, storage or the address bar', async () => {
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) =>
      vi.spyOn(console, m),
    );
    const { service, http } = setup(ENDPOINT);
    const result = service.submit('request', ANSWERS);
    http.expectOne(ENDPOINT).flush(null, { status: 500, statusText: 'Server Error' });
    await result.catch(() => undefined);
    spies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
    expect(JSON.stringify({ ...localStorage })).not.toContain('Sam');
    expect(JSON.stringify({ ...sessionStorage })).not.toContain('Sam');
    expect(location.href).not.toContain('Sam');
  });
});
