import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";

export async function getServerSideProps({ params, req, res }) {
  const token = getCookie("token", { req, res });

  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const userRes = await axios.get(
    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user",
    {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    props: {
      users: userRes.data.data,
    },
  };
}

const UserDetail = ({ users }) => {
  const router = useRouter();
  const { id } = router.query;
  const user = users.find((user) => user.id === id);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        User Detail
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <li key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <img src={user.profilePictureUrl} alt={user.name} />
          <p>{user.role}</p>
        </li>
      </div>
    </div>
  );
};

export default UserDetail;
