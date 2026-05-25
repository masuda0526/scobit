import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";


const client = new SSMClient({
  region: process.env.AWS_REGION
})

const getParameter = async (name: string) => {
  const result = await client.send(
    new GetParameterCommand({
      Name: name,
      WithDecryption: true
    })
  );

  const value = result.Parameter?.Value;

  if (!value) {
    throw new Error(`SSMに${name}がありません。`);
  }
  return value;
}

let initialized = false;

export const initEnv = async () => {

  if (initialized) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {

    process.env.JWT_SECRET_KEY =
      await getParameter(
        process.env.JWT_SECRET_PARAM!
      );

    process.env.RDB_PASS =
      await getParameter(
        process.env.RDB_PASS_PARAM!
      );
  }

  initialized = true;

}