import { createServerFn } from "@tanstack/react-start";

/** Only the server handler imports credentials and the delivery implementation. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { handleEnquiry } = await import("./enquiry.server");
    return handleEnquiry(data);
  });
