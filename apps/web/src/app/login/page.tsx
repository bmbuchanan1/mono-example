"use client";
import { getProviders } from "next-auth/react";
import { useSession, signIn } from "next-auth/react";
import GoogleIcon from "../../../public/icons/google.svg";
import { Button } from "ui";
import styles from "./styles.module.css";
import {log} from "logger";

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

export default function login({ providers }: Props) {
  const { data: session } = useSession();
  log(session);
  if (!session)
    return (
      <div className={styles.signin}>
        <Button
          className={styles.googlebutton}
          onClick={() => signIn("google")}
        >
          <GoogleIcon />
          Sign in with Google
        </Button>
      </div>
    );
}

// // // If not logged in redirect to signin
// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
// //   const session = await fetch();
//   const providers = await getProviders();
//   console.log(providers);

// //   if (session) {
// //     return {
// //       redirect: {
// //         permanent: false,
// //         destination: "/",
// //       },
// //     };
// //   }

//   return {
//     props: { providers },
//   };
// };