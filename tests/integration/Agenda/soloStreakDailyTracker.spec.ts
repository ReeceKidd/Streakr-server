import { createSoloStreakDailyTrackerJob } from "../../../src/scripts/initaliseSoloStreakTimezoneCheckers";
import streakoid from "../../../src/sdk/streakoid";
import { StreakTrackingEventType } from "../../../src/Models/StreakTrackingEvent";

jest.setTimeout(120000);

describe("soloStreakDailyTracker", () => {
  let userId: string;
  let maintainedSoloStreakId: string;
  let maintainedSoloStreakAgendaJobId: string;
  let maintainedStreakTrackingEventId: string;

  let completeTaskId: string;

  let lostSoloStreakId: string;
  let lostSoloStreakAgendaJobId: string;
  let lostStreakTrackingEventId: string;

  let inactiveSoloStreakId: string;
  let inactiveSoloStreakAgendaJobId: string;
  let inactiveStreakTrackingEventId: string;

  beforeAll(async () => {
    const username = "soloStreakDailyTrackerName";
    const email = "solostreaktracker@gmail.com";

    const registrationResponse = await streakoid.users.create(username, email);
    userId = registrationResponse.data._id;
  });

  afterAll(async () => {
    await streakoid.users.deleteOne(userId);

    await streakoid.soloStreaks.deleteOne(maintainedSoloStreakId);
    await streakoid.agendaJobs.deleteOne(maintainedSoloStreakAgendaJobId);
    await streakoid.streakTrackingEvents.deleteOne(
      maintainedStreakTrackingEventId
    );

    await streakoid.soloStreaks.deleteOne(lostSoloStreakId);
    await streakoid.agendaJobs.deleteOne(lostSoloStreakAgendaJobId);
    await streakoid.streakTrackingEvents.deleteOne(lostStreakTrackingEventId);

    await streakoid.soloStreaks.deleteOne(inactiveSoloStreakId);
    await streakoid.agendaJobs.deleteOne(inactiveSoloStreakAgendaJobId);
    await streakoid.streakTrackingEvents.deleteOne(
      inactiveStreakTrackingEventId
    );

    await streakoid.completeTasks.deleteOne(completeTaskId);
  });

  test("initialises soloStreakDailyTracker job correctly", async () => {
    expect.assertions(11);
    const timezone = "Europe/London";
    const job = await createSoloStreakDailyTrackerJob(timezone);
    const { attrs } = job as any;
    const {
      name,
      data,
      type,
      priority,
      nextRunAt,
      _id,
      repeatInterval,
      repeatTimezone
    } = attrs;
    expect(name).toEqual("soloStreakDailyTracker");
    expect(data.timezone).toEqual("Europe/London");
    expect(data.custom).toEqual(false);
    expect(Object.keys(data)).toEqual(["timezone", "custom"]);
    expect(type).toEqual("normal");
    expect(priority).toEqual(0);
    expect(nextRunAt).toBeDefined();
    expect(_id).toBeDefined();
    expect(repeatInterval).toBeDefined();
    expect(repeatTimezone).toEqual(null);
    expect(Object.keys(attrs)).toEqual([
      "name",
      "data",
      "type",
      "priority",
      "nextRunAt",
      "_id",
      "repeatInterval",
      "repeatTimezone"
    ]);

    await streakoid.agendaJobs.deleteOne(String(_id));
  });

  test("maintains streaks correctly", async () => {
    expect.assertions(8);

    const timezone = "Europe/London";

    const maintainedStreakName = "Painting";
    const maintainedStreakDescription = "Everyday we must paint for 30 minutes";

    const createMaintainedSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      maintainedStreakName,
      timezone,
      maintainedStreakDescription
    );
    maintainedSoloStreakId = createMaintainedSoloStreakResponse.data._id;

    const completeTaskResponse = await streakoid.completeTasks.create(
      userId,
      maintainedSoloStreakId,
      timezone
    );

    completeTaskId = completeTaskResponse.data._id;

    const job = await createSoloStreakDailyTrackerJob(timezone);

    await job!.run();

    const updatedMaintainedSoloStreakResponse = await streakoid.soloStreaks.getOne(
      maintainedSoloStreakId
    );

    const updatedMaintainedSoloStreak =
      updatedMaintainedSoloStreakResponse.data;

    const {
      currentStreak,
      completedToday,
      active,
      activity,
      pastStreaks
    } = updatedMaintainedSoloStreak;

    expect(currentStreak).toEqual({
      startDate: expect.any(String),
      numberOfDaysInARow: 1
    });
    expect(completedToday).toEqual(false);
    expect(active).toEqual(true);
    expect(activity).toEqual([
      {
        type: StreakTrackingEventType.MaintainedStreak,
        time: expect.any(String)
      }
    ]);
    expect(pastStreaks).toEqual([]);

    const streakTrackingEventResponse = await streakoid.streakTrackingEvents.getAll(
      { userId, streakId: maintainedSoloStreakId }
    );
    const streakTrackingEvent =
      streakTrackingEventResponse.data.streakTrackingEvents[0];

    expect(streakTrackingEvent.type).toEqual(
      StreakTrackingEventType.MaintainedStreak
    );
    expect(streakTrackingEvent.streakId).toEqual(maintainedSoloStreakId);
    expect(streakTrackingEvent.userId).toEqual(userId);

    maintainedSoloStreakAgendaJobId = String(job!.attrs._id);
    maintainedStreakTrackingEventId = streakTrackingEvent._id;
  });

  test("manages lost streaks correctly", async () => {
    expect.assertions(10);

    const timezone = "Europe/London";

    const lostStreakName = "Stretching";
    const lostStreakDescription = "Everyday I must stretch for 30 minutes";

    const createLostSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      lostStreakName,
      timezone,
      lostStreakDescription
    );
    lostSoloStreakId = createLostSoloStreakResponse.data._id;

    const completeTaskResponse = await streakoid.completeTasks.create(
      userId,
      lostSoloStreakId,
      timezone
    );

    completeTaskId = completeTaskResponse.data._id;

    const job = await createSoloStreakDailyTrackerJob(timezone);

    await job!.run();
    // Simulates an additional day passing
    await job!.run();

    const updatedLostSoloStreakResponse = await streakoid.soloStreaks.getOne(
      lostSoloStreakId
    );

    const updatedLostSoloStreak = updatedLostSoloStreakResponse.data;

    const {
      currentStreak,
      completedToday,
      active,
      activity,
      pastStreaks
    } = updatedLostSoloStreak;

    expect(currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(completedToday).toEqual(false);
    expect(active).toEqual(false);
    expect(activity.length).toEqual(2);
    const lostStreakEvent = activity.find((event: any) => {
      return event.type === StreakTrackingEventType.LostStreak;
    });
    expect(lostStreakEvent).toBeDefined();
    const maintainedStreakEvent = activity.find(
      (event: any) => event.type === StreakTrackingEventType.MaintainedStreak
    );
    expect(maintainedStreakEvent).toBeDefined();
    expect(pastStreaks).toEqual([
      {
        endDate: expect.any(String),
        numberOfDaysInARow: 1,
        startDate: expect.any(String)
      }
    ]);

    const lostStreakTrackingEventResponse = await streakoid.streakTrackingEvents.getAll(
      {
        userId,
        streakId: lostSoloStreakId,
        type: StreakTrackingEventType.LostStreak
      }
    );
    const lostStreakTrackingEvent =
      lostStreakTrackingEventResponse.data.streakTrackingEvents[0];

    expect(lostStreakTrackingEvent.type).toEqual(
      StreakTrackingEventType.LostStreak
    );
    expect(lostStreakTrackingEvent.streakId).toEqual(lostSoloStreakId);
    expect(lostStreakTrackingEvent.userId).toEqual(userId);

    lostSoloStreakAgendaJobId = String(job!.attrs._id);
    lostStreakTrackingEventId = lostStreakTrackingEvent._id;
  });

  test("manages inactive streaks correctly", async () => {
    expect.assertions(8);

    const timezone = "Europe/London";
    const streakName = "Singing";
    const streakDescription = "Everyday we must do 20 minutes of singing";

    const createInactiveSoloStreakResponse = await streakoid.soloStreaks.create(
      userId,
      streakName,
      timezone,
      streakDescription
    );
    inactiveSoloStreakId = createInactiveSoloStreakResponse.data._id;

    const job = await createSoloStreakDailyTrackerJob(timezone);
    inactiveSoloStreakAgendaJobId = String(job!.attrs._id);

    await job!.run();

    const updatedInactiveSoloStreakResponse = await streakoid.soloStreaks.getOne(
      inactiveSoloStreakId
    );

    const updatedInactiveSoloStreak = updatedInactiveSoloStreakResponse.data;

    const {
      currentStreak,
      completedToday,
      active,
      activity,
      pastStreaks
    } = updatedInactiveSoloStreak;

    expect(currentStreak).toEqual({ numberOfDaysInARow: 0 });
    expect(completedToday).toEqual(false);
    expect(active).toEqual(false);
    expect(activity).toEqual([
      { type: StreakTrackingEventType.InactiveStreak, time: expect.any(String) }
    ]);
    expect(pastStreaks).toEqual([]);

    const streakTrackingEventResponse = await streakoid.streakTrackingEvents.getAll(
      { userId, streakId: inactiveSoloStreakId }
    );
    const streakTrackingEvent =
      streakTrackingEventResponse.data.streakTrackingEvents[0];
    inactiveStreakTrackingEventId = streakTrackingEvent._id;

    expect(streakTrackingEvent.type).toEqual(
      StreakTrackingEventType.InactiveStreak
    );
    expect(streakTrackingEvent.streakId).toEqual(inactiveSoloStreakId);
    expect(streakTrackingEvent.userId).toEqual(userId);
  });
});
