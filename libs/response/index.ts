export const createEmptyResponse = () => new Response();
export const createErrorResponse = ({
  code,
  message,
}: {
  code: number;
  message: string;
}) => Response.json({ message }, { status: code });
