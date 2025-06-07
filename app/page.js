"use client";
import { useState, useEffect } from "react";
import st from "./page.module.css";

export default function Home() {
  const [totalCount, setTotalCount] = useState(0);
  const [name, setName] = useState('');
  const [weightDone, setWeightDone] = useState(0);
  const [boxes, setBoxes] = useState(0);
  const [entries, setEntries] = useState([]);
  const [doneWeight, setDoneWeight] = useState(0);
  const [nowString, setNowString] = useState('');

  const passwords = {
    "Андрюха": "1234",
    "Русик": "22",
    "Стас": "passStas",
    "Влад": "passVlad",
    "Лёха": "passLeha",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setNowString(now);
    }, 1000); // каждую секунду обновление
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTotal = async () => {
      const res = await fetch("/api/total");
      const data = await res.json();
      setTotalCount(data.total || 0);
    };

    const fetchEntries = async () => {
      const res = await fetch("/api/get-entries");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    };

    fetchTotal();
    fetchEntries();
  }, []);



  useEffect(() => {
    const total = entries.reduce((acc, entry) => {
      const weights = Array.isArray(entry.weights) ? entry.weights : [];
      return acc + weights.reduce((a, b) => a + b, 0);
    }, 0);
    setDoneWeight(Number(total.toFixed(1)));
  }, [entries]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/save-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, weight: +weightDone, boxes: +boxes }),
    });

    const res = await fetch("/api/get-entries");
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
  };

  return (
    <div className={st.wrapper}>
      <header className={st.header}>
        <div className={st.nowDays}>
          {nowString}
        </div>
        <div className={st.totalWeight}>
          <span
            onClick={async () => {
              const totalValue = +prompt("Введите общий вес");
              await fetch("/api/total", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total: totalValue }),
              });
              setTotalCount(totalValue);
            }}
          >
            +
          </span>
          Общий вес <span>{totalCount} кг</span>
        </div>
        <div className={st.doneWeight}>
          Сделано <span>{doneWeight} кг</span>
        </div>
      </header>

      <ol className={st.personeList}>
      {[...entries]

          .map((entry) => (
              <li key={entry.name}>
                <div>
                <div className={st.listName}>
                  {entry.name}: {Math.round(entry.weights.reduce((a, b) => a + b, 0))} кг
                </div>
                  
                  <ul className={st.listItem}>
                    {entry.weights.map((w, index) => (
                      <li key={index}>{w} кг</li>
                    ))}
                  </ul>
                  <button
  onClick={async () => {
    const confirmed = confirm("Точно удалить последнюю запись?");
    if (!confirmed) return;

    const password = prompt("Введите пароль");
    if (!password) return;

    // Проверка пароля из объекта passwords
    if (password === passwords[entry.name]) {
      await fetch("/api/delete-last", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: entry.name }),
      });

      // Обновим список после удаления
      const res = await fetch("/api/get-entries");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } else {
      alert("Неверный пароль!");
    }
  }}
>
  X
</button>

                </div>
              </li>
              ))}
      </ol>
      <form className={st.formPush} onSubmit={handleSubmit}>
        <input
          type="number"
          min={2}
          step="any"
          placeholder="Укажите вес"
          onChange={(e) => setWeightDone(e.target.value)}
        />
        <input
          type="number"
          min={1}
          placeholder="Кол. ящиков"
          onChange={(e) => setBoxes(e.target.value)}
        />
        <select onChange={(e) => setName(e.target.value)}>
          <option value="">Введи имя сотрудника</option>
          <option value="Андрюха">Андрюха</option>
          <option value="Русик">Русик</option>
          <option value="Стас">Стас</option>
          <option value="Влад">Влад</option>
          <option value="Лёха">Лёха</option>
        </select>
        <button type="submit">отправить</button>
      </form>
    </div>
  );
}
