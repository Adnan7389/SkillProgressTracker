import { Test, TestingModule } from "@nestjs/testing";
import { StreaksService } from "./streaks.service";
import { auth } from "../../auth/auth.service";
import { Logger } from "@nestjs/common";

jest.mock("../../auth/auth.service");

describe("StreaksService", () => {
  let service: StreaksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreaksService, Logger],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
  });

  it("should be defined", () => {
    console.log(auth);
    expect(service).toBeDefined();
  });
});
