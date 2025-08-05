import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../CSS/Category.css";

// This component renders a set of category cards for a shop.
const CategoryCards = () => {
  const { t, i18n } = useTranslation();

  // Be sure to place your images in the "public/assets/pic" folder
  // so they are served as static files at runtime.
  const categories = [
    {
      id: 1,
      category: "Vaccine",
      image: "cat3.b197b0.webp",
      alt: "Live Vaccine",
      translationKey: "vaccine",
    },
    {
      id: 2,
      category: "Vitamins",
      image: "cat4-1.b197b0.webp",
      alt: "Vitamins",
      translationKey: "vitamins",
    },
    {
      id: 3,
      category: "Disinfectant",
      image: "cat5.b197b0.webp",
      alt: "Disinfectants",
      translationKey: "disinfectants",
    },
    {
      id: 4,
      category: "Fertilizer",
      image: "سماد.jpg",
      alt: "Fertilizer",
      translationKey: "fertilizers",
    },
    {
      id: 5,
      category: "Seeds",
      image: "بذور زراعية.jpg",
      alt: "Seeds",
      translationKey: "seeds",
    },
    {
      id: 6,
      category: "Equipment",
      image: "معدات زراعية.webp",
      alt: "Equipment",
      translationKey: "equipment",
    },
  ];

  return (
    <div
      className="cards-container"
      id="shop"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {categories.map((item) => (
        <div className="circle-card" key={item.id}>
          <Link to={`/Shop?category=${item.category}`}>
            <img
              className="circle-card-img"
              src={item.image}
              alt={t(item.alt)}
            />
            <div className="circle-card-body">
              <h5
                className={`circle-card-title ${
                  i18n.language === "ar" ? "font-arabic" : ""
                }`}
              >
                {t(item.translationKey)}
              </h5>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryCards;
