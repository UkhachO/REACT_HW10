import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./CatImage.module.css";

export default function CatImage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFirstLoad = useRef(true);
  const isMounted = useRef(false);

  const fetchCat = async () => {
    if (!isMounted.current) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );

      const data = response.data;
      if (
        Array.isArray(data) &&
        data.length > 0 &&
        typeof data[0].url === "string"
      ) {
        if (isMounted.current) {
          setImageUrl(data[0].url);
        }
      } else {
        throw new Error("Неверный формат ответа API");
      }
    } catch (err) {
      if (isMounted.current) {
        setError("Ошибка при загрузке изображения");
        console.error(err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;

    if (isFirstLoad.current) {
      fetchCat();
      isFirstLoad.current = false;
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Случайное изображение кошки</h2>

      {loading && <p className={styles.message}>Загрузка...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && imageUrl && (
        <img src={imageUrl} alt="Кошка" className={styles.catImage} />
      )}

      <button
        onClick={fetchCat}
        className={styles.reloadButton}
        disabled={loading}
      >
        {loading ? "Загружаем..." : "Загрузить новое изображение"}
      </button>
    </div>
  );
}
