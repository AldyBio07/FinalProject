import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";

export async function getServerSideProps({ req, res }) {
  const token = getCookie("token", { req, res });
  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  const bannersRes = await axios.get(
    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
    {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const promotionsRes = await axios.get(
    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
    {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const categoriesRes = await axios.get(
    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
    {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const activitiesRes = await axios.get(
    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
    {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    props: {
      banners: bannersRes.data.data,
      promotions: promotionsRes.data.data,
      categories: categoriesRes.data.data,
      activity: activitiesRes.data.data,
    },
  };
}

const Dashboard = ({ banners, promotions, categories, activity }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const logout = () => {
    deleteCookie("token");
    router.push("/auth/login");
  };

  return (
    <div>
      <h1>Banners</h1>
      {banners.map((banner) => (
        <div key={banner.id}>
          <h2>{banner.name}</h2>
          <p>{banner.description}</p>
          <img src={banner.imageUrl} alt={banner.name} />
        </div>
      ))}
      <h1>Promos</h1>
      <div className="grid grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <div key={promo.id}>
            <h2>{promo.title}</h2>
            <p>{promo.description}</p>
            <p>{promo.promo_discount_price}</p>
            <p>{promo.minimum_claim_price}</p>
            <p>Promo Code : {promo.promo_code}</p>
            <img src={promo.imageUrl} alt={promo.title} />
          </div>
        ))}
      </div>

      <h1>Categories</h1>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <img src={category.imageUrl} alt={category.name} />
          </div>
        ))}
      </div>
      <button onClick={logout}>Logout</button>
      {errorMessage && <p>{errorMessage}</p>}

      <h1>Activities</h1>
      <div className="grid grid-cols-3 gap-4">
        {activity.map((activity) => (
          <div key={activity.id}>
            <h2>{activity.category.name}</h2>
            <img src={activity.category.imageUrl} alt={activity.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
