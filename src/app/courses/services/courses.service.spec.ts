import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  COURSES,
  findCourseById,
  findLessonsForCourse
} from "../../../../server/db-data";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesSvc: CoursesService, httpTestCtrl: HttpTestingController;
  let courseId: number;

  beforeAll(() => {
    console.log("************started testing CoursesService****************");
  });

  beforeEach(() => {
    console.log("Calling BeforeEach");

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    coursesSvc = TestBed.inject(CoursesService);
    httpTestCtrl = TestBed.inject(HttpTestingController);
    courseId = 12;
  });

  it("should retrieve all courses", () => {
    coursesSvc.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned!");
      expect(courses.length).toBe(12, "incorrect number of courses!");
    });

    const req = httpTestCtrl.expectOne(coursesSvc.courseUrl);
    expect(req.request.method).toEqual("GET");
    req.flush({ payload: Object.values(COURSES) });
  });

  it("should find course by identifier", () => {
    coursesSvc.findCourseById(courseId).subscribe((course) => {
      expect(course).toBeTruthy(`Course with id=${courseId} not found!`);
      expect(course.id).toBe(courseId, "incorrect course returned!");
      expect(course.titles.description).toBe(
        "Angular Testing Course",
        "incorrect title description returned!"
      );
    });

    const req = httpTestCtrl.expectOne(`${coursesSvc.courseUrl}/${courseId}`);
    expect(req.request.method).toEqual("GET");
    req.flush(findCourseById(courseId));
  });

  describe('SaveCourse method', () => {
    let changes: Partial<Course>
     beforeEach(() => {
    changes= {
      titles: {
        description: "Angular Testing Course 2",
        longDescription: "Updated course",
      },
    };
   });

    it("should save course with changes", () => {
      coursesSvc.saveCourse(courseId, changes).subscribe((course) => {
        expect(course).toBeTruthy(`Course with id=${courseId} not found!`);
        expect(course.id).toBe(courseId, "incorrect course returned!");
        expect(course.titles.description).toBe(
          changes.titles.description,
          "incorrect title description returned!"
        );
        expect(course.titles.longDescription).toBe(
          changes.titles.longDescription,
          "incorrect title longDescription returned!"
        );
      });

      const req = httpTestCtrl.expectOne(`${coursesSvc.courseUrl}/${courseId}`);
      expect(req.request.method).toEqual("PUT");
      expect(req.request.body).toBe(changes);
      req.flush({ ...findCourseById(courseId), ...changes });
    });

    it("should fail to save course with changes", () => {
      coursesSvc.saveCourse(courseId, changes).subscribe(
        () => {
          fail("save course should not have succeeded");
        },
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpTestCtrl.expectOne(`${coursesSvc.courseUrl}/${courseId}`);
      expect(req.request.method).toEqual("PUT");
      expect(req.request.body).toBe(changes);
      req.flush("Save course failed.", {
        status: 500,
        statusText: "Internal Server Error",
      });
    });
  });

  it("should find list of lessons", () => {
    coursesSvc.findLessons(courseId).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(10);
    });

    const req = httpTestCtrl.expectOne(
      (req) => req.url == coursesSvc.lessonUrl
    );
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual(courseId.toString());
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");
    req.flush({ payload: findLessonsForCourse(courseId) });
  });

  afterEach(() => {
    console.log("Calling AfterEach");
    httpTestCtrl.verify();
  });

  afterAll(() => {
    console.log("************finished testing CoursesService****************");
  });
});
