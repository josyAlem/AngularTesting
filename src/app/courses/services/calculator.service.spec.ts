import { TestBed } from "@angular/core/testing";
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';
describe("CalculatorService", () => {
  let calcSvc: CalculatorService;
let loggerSvc:LoggerService;

  beforeAll(() => {
    console.log(
      "************started testing CalculatorService****************"
    );
  });

  beforeEach(() => {
    console.log("Calling BeforeEach");
    const loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    TestBed.configureTestingModule({
      providers:[
        CalculatorService,
        {provide:LoggerService,useValue:loggerSpy}
      ]
    });

    calcSvc = TestBed.inject(CalculatorService);
    loggerSvc=TestBed.inject(LoggerService);
  });

  it("should add two numbers", () => {
    //Act
    const result = calcSvc.add(1, 2);

    //Assert
    expect(result).toBe(3);
  });

  it("should subtract two numbers", () => {
    //Act
    const result = calcSvc.subtract(3, 1);

    //Assert
    expect(result).toBe(2, "unexpected result for subtract");
  });

  afterEach(() => {
    console.log("Calling AfterEach");
    expect(loggerSvc.log).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    console.log(
      "************finished testing CalculatorService****************"
    );
  });
});
