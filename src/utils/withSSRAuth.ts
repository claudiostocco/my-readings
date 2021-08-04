import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { RefreshTokenError } from "./errors/RefreshTokenError";

export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    if (!cookies['myreadings.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    try {
      return await fn(ctx);
    } catch (error) {
      // Quem chama o erro é return Promise.reject(new RefreshTokenError());
      // Então porque o JavaScript não entende que o erro é uma instância de RefreshTokenError?
      console.log('Error is RefreshTokenError:', error instanceof RefreshTokenError);

      if (error instanceof RefreshTokenError) {
        destroyCookie(ctx, 'myreadings.token');
        destroyCookie(ctx, 'myreadings.refreshToken');
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      } else {
        // Coloquei este else só para não ficar dando erro, a questão é: 
        // Porque (error instanceof RefreshTokenError) não retorna true?
        destroyCookie(ctx, 'myreadings.token');
        destroyCookie(ctx, 'myreadings.refreshToken');
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
    }

  }
}