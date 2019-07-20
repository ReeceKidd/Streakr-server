import {
  createStripeCustomerSubscriptionMiddlewares,
  createStripeCustomerSubscriptionBodyValidationMiddleware,
  doesStripeCustomerExistMiddleware,
  createStripeCustomerMiddleware,
  createStripeSubscriptionMiddleware,
  handleInitialPaymentOutcomeMiddleware,
  sendSuccessfulSubscriptionMiddleware,
  getDoesStripeCustomerExistMiddleware,
  stripe,
  getCreateStripeCustomerMiddleware,
  getCreateStripeSubscriptionMiddleware
} from "./createStripeCustomerSubscriptionMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

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

  describe("doesStripeCustomerExistMiddleware", () => {
    test("defines response.locals.stripeCustomer", async () => {
      expect.assertions(3);
      const email = "test@test.com";
      const findOne = jest.fn().mockResolvedValue(true);
      const stripeCustomerModel: any = {
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
      const doesStripeCustomerExistMiddleware = getDoesStripeCustomerExistMiddleware(
        stripeCustomerModel
      );

      await doesStripeCustomerExistMiddleware(request, response, next);

      expect(findOne).toBeCalledWith({ email });
      expect(response.locals.stripeCustomer).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("calls next with DoesStripeCustomerExistMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const email = "test@test.com";
      const stripeCustomerModel: any = {};
      const request: any = {
        body: {
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const next = jest.fn();
      const doesStripeCustomerExistMiddleware = getDoesStripeCustomerExistMiddleware(
        stripeCustomerModel
      );

      await doesStripeCustomerExistMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.DoesStripeCustomerExistMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("createStripeCustomerMiddleware", () => {
    test("sets response.locals.stripeCustomer is stripeCustomer does not exist", async () => {
      expect.assertions(4);
      const stripeCustomerId = "123";
      stripe.customers.create = jest
        .fn()
        .mockResolvedValue({ id: stripeCustomerId });
      const token = "1234";
      const email = "reecekidd123@gmail.com";
      const request: any = {
        body: {
          token,
          email
        }
      };
      const response: any = {
        locals: {}
      };
      const save = jest.fn(() => Promise.resolve(true));
      class StripeCustomerModel {
        email: string;
        token: string;
        customerId: string;

        constructor(email: string, token: string, customerId: string) {
          this.email = email;
          this.token = token;
          this.customerId = customerId;
        }

        save() {
          return save();
        }
      }
      const next = jest.fn();
      const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(
        StripeCustomerModel as any
      );

      await createStripeCustomerMiddleware(request, response, next);

      expect(stripe.customers.create).toBeCalledWith({ source: token, email });
      expect(save).toBeCalledWith();
      expect(response.locals.stripeCustomer).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test(" calls next without anything else if stripeCustomer already exists", () => {
      expect.assertions(1);
      const stripeCustomerId = "123";
      const token = "1234";
      const email = "reecekidd123@gmail.com";
      const request: any = {
        body: {
          token,
          email
        }
      };
      const response: any = {
        locals: {
          stripeCustomer: {
            id: stripeCustomerId
          }
        }
      };
      const next = jest.fn();
      const createStripeCustomerMiddleware = getCreateStripeCustomerMiddleware(
        {} as any
      );

      createStripeCustomerMiddleware(request, response, next);

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
    expect.assertions(7);

    expect(createStripeCustomerSubscriptionMiddlewares.length).toEqual(6);
    expect(createStripeCustomerSubscriptionMiddlewares[0]).toBe(
      createStripeCustomerSubscriptionBodyValidationMiddleware
    );
    expect(createStripeCustomerSubscriptionMiddlewares[1]).toBe(
      doesStripeCustomerExistMiddleware
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
      sendSuccessfulSubscriptionMiddleware
    );
  });
});
