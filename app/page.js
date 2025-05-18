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

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch("/api/total");
        const data = await res.json();
        setTotalCount(data.total || 0);
      } catch (error) {
        console.error("Ошибка загрузки общего веса:", error);
      }
    };

    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/get-entries");
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Ошибка загрузки записей:", error);
        setEntries([]);
      }
    };

    fetchTotal();
    fetchEntries();
  }, []);

  useEffect(() => {
    const total = entries.reduce((acc, entry) => acc + (entry.weight || 0), 0);
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

  const handleDelete = async (name) => {
    const confirmed = confirm(`Удалить сотрудника ${name}?`);
    if (!confirmed) return;

    await fetch("/api/delete-entry", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const updated = await fetch("/api/get-entries");
    const data = await updated.json();
    setEntries(Array.isArray(data) ? data : []);
  };

  return (
    <div className={st.wrapper}>
      <header className={st.header}>
        <div className={st.nowDays}>Сегодня</div>
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
            .o?
          </span>
          Общий вес
          <span>{totalCount} кг</span>
        </div>

        <div className={st.doneWeight}>
          Сделано <span>{doneWeight} кг</span>
        </div>
      </header>

      <ol className={st.personeList}>
        {Array.isArray(entries) && entries.map((entry) => (
          <li key={entry.name}>
            {entry.name}: {Number(entry.weight.toFixed(1))} кг, {entry.boxes} ящиков.
            <button onClick={() => handleDelete(entry.name)}>Удалить</button>
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
          <option value="Щичек">Щичек</option>
        </select>
        <button type="submit">отправить</button>
      </form>
    </div>
  );
}
