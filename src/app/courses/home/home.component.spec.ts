import {
  ComponentFixture,
  TestBed,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";
import { Course } from "../model/course";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesSvc: any;

  const allCourses = setupCourses();
  const beginnerCourses: Course[] = allCourses.filter(
    (c) => c.category == "BEGINNER"
  );
  const advancedCourses: Course[] = allCourses.filter(
    (c) => c.category == "ADVANCED"
  );

  beforeEach(async () => {
    const coursesSvcSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesSvcSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
    coursesSvc = TestBed.inject(CoursesService);
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesSvc.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs displyed!");
  });

  it("should display only advanced courses", () => {
    coursesSvc.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs displyed!");
  });

  it("should display both tabs", () => {
    coursesSvc.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs displyed!");
  });

  it("should display appropriate courses when tab clicked", (done: DoneFn) => {
    coursesSvc.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]); //advanced tab

    fixture.detectChanges();

    setTimeout(() => {
      const tabBody = el.query(By.css(".mat-tab-body-active"));
      const cards = tabBody.queryAll(By.css(".mat-card-title"));
      const title = cards[0];
      const firstCourse = advancedCourses[0];
      expect(cards.length).toBe(
        advancedCourses.length,
        "Unexpected number of cards in Advanced courses tab!"
      );
      expect(title.nativeElement.textContent).toBe(
        firstCourse.titles.description,
        "Unexpected course title!"
      );

      click(tabs[0]); //beginners tab

      fixture.detectChanges();
      setTimeout(() => {
        const tabBody = el.query(By.css(".mat-tab-body-active"));
        const cards = tabBody.queryAll(By.css(".mat-card-title"));
        const title = cards[0];
        const firstCourse = beginnerCourses[0];
        expect(cards.length).toBe(
          beginnerCourses.length,
          "Unexpected number of cards in Beginner courses tab!"
        );
        expect(title.nativeElement.textContent).toBe(
          firstCourse.titles.description,
          "Unexpected course title!"
        );

        done();
      }, 500);
    }, 500);
  });
});
