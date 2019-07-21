import {
  createStripeCustomerSubscriptionMiddlewares,
  createStripeCustomerSubscriptionBodyValidationMiddleware,
  createStripeCustomerMiddleware,
  createStripeSubscriptionMiddleware,
  handleInitialPaymentOutcomeMiddleware,
  sendSuccessfulSubscriptionMiddleware,
  stripe,
  getCreateStripeCustomerMiddleware,
  getCreateStripeSubscriptionMiddleware,
  isUserAnExistingStripeCustomerMiddleware,
  getIsUserAnExistingStripeCustomerMiddleware,
  addStripeSubscriptionToUserMiddleware,
  getAddStripeSubscriptionToUserMiddleware
} from "./createStripeCustomerSubscriptionMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { UserTypes } from "../../Models/User";

describe("createStripeCustomerSubscriptionMiddlewares", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createStripeCustomerSubscriptionMiddleware", () => {
    const token = "1234";
    const email = "test@test.com";

    test("sends correct error response when unsupported key is sent", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { unsupportedKey: 1234, token, email }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(400);
      expect(send).toBeCalledWith({
        message: '"unsupportedKey" is not allowed'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when token is not defined", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { email }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "token" fails because ["token" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when email is not defined", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { token }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "email" fails because ["email" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when email is not a string", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { token, email: 1234 }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "email" fails because ["email" must be a string]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct error response when email is not valid", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { token, email: "not an email" }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      createStripeCustomerSubscriptionBodyValidationMiddleware(
        request,
        response,
        next
      );

      expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
      expect(send).toBeCalledWith({
        message: 'child "email" fails because ["email" must be a valid email]'
      });
      expect(next).not.toBeCalled();
    });
  });

  describe("isUserAnExistingStripeCustomerMiddleware", () => {
    test("calls next if user exists and is not premium already", async () => {
      expect.assertions(2);
      const email = "test@test.com";
      const findOne = jest.fn().mockResolvedValue({ type: "basic" });
      const userModel: any = {
        findOne
      };
      const request: any = {
        body: {
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(
        userModel
      );

      await isUserAnExistingStripeCustomerMiddleware(request, response, next);

      expect(findOne).toBeCalledWith({ email });
      expect(next).toBeCalledWith();
    });

    test("calls next with StripeSubscriptionUserDoesNotExist error if user doesn't exist", async () => {
      expect.assertions(1);
      const email = "test@test.com";
      const findOne = jest.fn().mockResolvedValue(false);
      const userModel: any = {
        findOne
      };
      const request: any = {
        body: {
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(
        userModel
      );

      await isUserAnExistingStripeCustomerMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.StripeSubscriptionUserDoesNotExist)
      );
    });

    test("calls next with CustomerIsAlreadySubscribed error if user type is set to premium", async () => {
      expect.assertions(1);
      const email = "test@test.com";
      const findOne = jest.fn().mockResolvedValue({
        type: UserTypes.premium
      });
      const userModel: any = {
        findOne
      };
      const request: any = {
        body: {
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(
        userModel
      );

      await isUserAnExistingStripeCustomerMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.CustomerIsAlreadySubscribed)
      );
    });

    test("calls next with IsUserAnExistingStripeCustomerMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const email = "test@test.com";
      const userModel: any = {};
      const request: any = {
        body: {
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(
        userModel
      );

      await isUserAnExistingStripeCustomerMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.IsUserAnExistingStripeCustomerMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("createStripeCustomerMiddleware", () => {
    test("creates stripe customer and sets response.locals.stripeCustomer", async () => {
      expect.assertions(4);
      const token = "1234";
      const email = "reecekidd123@gmail.com";
      const stripeCustomerId = "123";
      stripe.customers.create = jest
        .fn()
        .mockResolvedValue({ id: stripeCustomerId });
      const updateOne = jest.fn().mockResolvedValue({});
      const userModel = {
        updateOne
      };
      const request: any = {
        body: {
          token,
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(
        userModel as any
      );

      await createStripeCustomerMiddleware(request, response, next);

      expect(stripe.customers.create).toBeCalledWith({ source: token, email });
      expect(updateOne).toBeCalledWith(
        { email },
        { $set: { "stripe.customerId": "123" } },
        { new: true }
      );
      expect(response.locals.stripeCustomer).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("calls next with CreateStripeCustomerMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();
      const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(
        {} as any
      );

      await createStripeCustomerMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.CreateStripeCustomerMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("createStripeSubscriptionMiddleware", () => {
    test("creates stripe subscription for correct plan", async () => {
      expect.assertions(3);
      const stripeCustomer = {
        customerId: "123"
      };
      stripe.subscriptions.create = jest.fn().mockResolvedValue({});
      const stripePlan = "stripePlan";
      const request: any = {};
      const response: any = {
        locals: {
          stripeCustomer
        }
      };
      const next = jest.fn();
      const createStripeSubscriptionMiddleware = getCreateStripeSubscriptionMiddleware(
        stripePlan
      );

      await createStripeSubscriptionMiddleware(request, response, next);

      expect(stripe.subscriptions.create).toBeCalledWith({
        customer: stripeCustomer.customerId,
        items: [{ plan: stripePlan }],
        expand: ["latest_invoice.payment_intent"]
      });
      expect(response.locals.subscription).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("calls next with CreateStripeSubscriptionMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();
      const createStripeSubscriptionMiddleware = getCreateStripeSubscriptionMiddleware(
        "test"
      );

      await createStripeSubscriptionMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.CreateStripeSubscriptionMiddleware)
      );
    });
  });

  describe("handleInitialPaymentOutcomeMiddleware", () => {
    test(" calls next() if subscriptionStatus is active and paymentIntentStatus succeeded", () => {
      expect.assertions(1);
      const subscription = {
        status: "active",
        latest_invoice: {
          payment_intent: {
            status: "succeeded"
          }
        }
      };
      const request: any = {};
      const response: any = {
        locals: { subscription }
      };
      const next = jest.fn();

      handleInitialPaymentOutcomeMiddleware(request, response, next);

      expect(next).toBeCalledWith();
    });

    test("calls next with IncompletePayment error when status is incomplete", () => {
      expect.assertions(1);
      const subscription = {
        status: "incomplete",
        latest_invoice: {
          payment_intent: {
            status: "succeeded"
          }
        }
      };
      const request: any = {};
      const response: any = {
        locals: { subscription }
      };
      const next = jest.fn();

      handleInitialPaymentOutcomeMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.IncompletePayment, expect.any(Error))
      );
    });

    test("calls next with UnknownPaymentStatus for all other payment issues", () => {
      expect.assertions(1);
      const subscription = {
        status: undefined,
        latest_invoice: {
          payment_intent: {
            status: "unknown"
          }
        }
      };
      const request: any = {};
      const response: any = {
        locals: { subscription }
      };
      const next = jest.fn();

      handleInitialPaymentOutcomeMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.UnknownPaymentStatus, expect.any(Error))
      );
    });

    test("calls next with HandleInitialPaymentOutcomeMiddleware on middleware failure", () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {
        locals: {}
      };
      const next = jest.fn();

      handleInitialPaymentOutcomeMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.HandleInitialPaymentOutcomeMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("addStripeSubscriptionToUserMiddleware", () => {
    test("updates user model with stripe subscription", async () => {
      expect.assertions(2);
      const email = "stripe@gmail.com";
      const stripeCustomer = {
        email
      };
      const subscription = "subscription";
      const request: any = {};
      const response: any = {
        locals: {
          stripeCustomer,
          subscription
        }
      };
      const next = jest.fn();
      const update = jest.fn().mockResolvedValue(true);
      const userModel = {
        update
      };
      const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(
        userModel as any
      );

      await addStripeSubscriptionToUserMiddleware(request, response, next);

      expect(update).toBeCalledWith(
        { email },
        { $set: { "stripe.subscription": subscription } },
        { new: true }
      );
      expect(next).toBeCalledWith();
    });

    test("calls next with AddStripeSubscriptionToUserMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();
      const userModel: any = {};
      const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(
        userModel
      );

      await addStripeSubscriptionToUserMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.AddStripeSubscriptionToUserMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("sendSuccessfulSubscriptionMiddleware", () => {
    test("sends stripeCustomer and subscription information in response", () => {
      expect.assertions(2);
      const request: any = {};
      const stripeCustomer = {};
      const subscription = {};
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const response: any = {
        locals: {
          stripeCustomer,
          subscription
        },
        status
      };
      const next = jest.fn();

      sendSuccessfulSubscriptionMiddleware(request, response, next);

      expect(status).toBeCalledWith(201);
      expect(send).toBeCalledWith({ stripeCustomer, subscription });
    });

    test("calls next with SendSuccessfulSubscriptionMiddleware on middleware failure", () => {
      expect.assertions(1);
      const request: any = {};
      const response = undefined as any;
      const next = jest.fn();

      sendSuccessfulSubscriptionMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.SendSuccessfulSubscriptionMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  test("are defined in the correct order", () => {
    expect.assertions(8);

    expect(createStripeCustomerSubscriptionMiddlewares.length).toEqual(7);
    expect(createStripeCustomerSubscriptionMiddlewares[0]).toBe(
      createStripeCustomerSubscriptionBodyValidationMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[1]).toBe(
      isUserAnExistingStripeCustomerMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[2]).toBe(
      createStripeCustomerMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[3]).toBe(
      createStripeSubscriptionMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[4]).toBe(
      handleInitialPaymentOutcomeMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[5]).toBe(
      addStripeSubscriptionToUserMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[6]).toBe(
      sendSuccessfulSubscriptionMiddleware
    );
  });
});
