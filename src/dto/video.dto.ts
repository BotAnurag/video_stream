import * as z from "zod";

export const CreateVideoDto = z.object({
  name: z.string(),
});
