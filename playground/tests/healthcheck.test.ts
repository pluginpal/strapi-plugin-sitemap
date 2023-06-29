import { setupStrapi, stopStrapi } from "./helpers";

jest.setTimeout(20000);

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe("Strapi is defined", () => {
  it("just works", () => {
    expect(strapi).toBeDefined();
  });
});
