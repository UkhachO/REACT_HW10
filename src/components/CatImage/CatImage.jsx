import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CatImage.module.css";

export default function CatImage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCat() {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          "https://api.thecatapi.com/v1/images/search",
          { signal: controller.signal }
        );

        const data = response.data;
        if (Array.isArray(data) && data[0]?.url) {
          setImageUrl(data[0].url);
        } else {
          setError("Неверный формат ответа API");
        }
      } catch (err) {
        if (axios.isCancel(err)) {
        } else {
          setError("Ошибка при загрузке изображения");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCat();

    return () => controller.abort();
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Случайное изображение кошки</h2>

      {loading && <p className={styles.message}>Загрузка...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && imageUrl && (
        <img src={imageUrl} alt="Кошка" className={styles.catImage} />
      )}

      <button
        onClick={handleReload}
        className={styles.reloadButton}
        disabled={loading}
      >
        {loading ? "Загружаем..." : "Загрузить новое изображение"}
      </button>
    </div>
  );
}
