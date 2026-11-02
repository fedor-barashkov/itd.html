import { useState } from 'react';

export default function App() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const programs = [
    {
      id: 'itd',
      title: 'ИТД',
      subtitle: 'Исполнительная документация',
      description: 'Акты освидетельствования (АОСР, АОКР, АОУР), журналы работ (КС-1 — КС-6), сертификаты и паспорта на материалы, реестры ИД.',
      features: ['Акты скрытых работ', 'Журналы работ', 'Сертификаты', 'Реестр ИД', 'Печать АОСР'],
      color: '#60cdff',
      icon: '📋',
      href: '/itd.html',
    },
    {
      id: 'estimates',
      title: 'Сметы',
      subtitle: 'Проектно-сметная документация',
      description: 'Сметы, разделы проектной документации (ПД), замечания экспертизы, объекты строительства, контроль согласования.',
      features: ['Сметы и расчёты', 'Разделы ПД', 'Замечания экспертизы', 'Объекты', 'Контроль стадий'],
      color: '#7fd572',
      icon: '🧮',
      href: '/estimates.html',
    },
    {
      id: 'business',
      title: 'Бизнес',
      subtitle: 'Договоры, счета, банк',
      description: 'Договоры с контрагентами, счета на оплату, акты выполненных работ (КС-2/КС-3), банк и операции, закупки, база заказчиков и исполнителей.',
      features: ['Договоры', 'Счета и акты', 'Банк и операции', 'Закупки', 'Заказчики / Исполнители'],
      color: '#ffd75e',
      icon: '💼',
      href: '/business.html',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--line)] bg-[var(--side)] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center font-bold text-sm">
            ПСД
          </div>
          <div>
            <h1 className="text-lg font-semibold">Бизнес-панель ПСД</h1>
            <p className="text-xs text-[var(--fg-3)]">Проектно-сметное бюро • 3 модуля</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Выберите модуль</h2>
            <p className="text-[var(--fg-2)] max-w-2xl mx-auto">
              Три самостоятельные программы для проектно-сметного бюро.
              Каждая работает отдельно, хранит данные локально и может быть развёрнута как независимый проект.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {programs.map(prog => (
              <a
                key={prog.id}
                href={prog.href}
                className="group block"
                onMouseEnter={() => setHoveredCard(prog.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="h-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    borderColor: hoveredCard === prog.id ? prog.color : undefined,
                    boxShadow: hoveredCard === prog.id ? `0 8px 30px ${prog.color}20` : undefined,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: prog.color + '20' }}
                  >
                    {prog.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-1">{prog.title}</h3>
                  <p className="text-sm text-[var(--fg-3)] mb-3">{prog.subtitle}</p>

                  {/* Description */}
                  <p className="text-sm text-[var(--fg-2)] mb-4 leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {prog.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[var(--fg-2)]">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: prog.color }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: prog.color }}>
                    Открыть модуль
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="text-2xl mb-2">💾</div>
              <h4 className="font-semibold mb-1">Локальное хранение</h4>
              <p className="text-sm text-[var(--fg-3)]">Все данные хранятся в браузере. Экспорт/импорт JSON для резервных копий.</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="text-2xl mb-2">🖨️</div>
              <h4 className="font-semibold mb-1">Печатные формы</h4>
              <p className="text-sm text-[var(--fg-3)]">АОСР по Приказу 344/пр, счета, акты КС-2/КС-3, журналы работ.</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-semibold mb-1">Работает везде</h4>
              <p className="text-sm text-[var(--fg-3)]">Откройте на компьютере, планшете или телефоне. Адаптивный дизайн.</p>
            </div>
          </div>

          {/* How to deploy */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <h3 className="text-lg font-bold mb-3">📦 Как развернуть каждый модуль</h3>
            <ol className="space-y-2 text-sm text-[var(--fg-2)]">
              <li className="flex gap-2">
                <span className="font-bold text-[var(--accent)]">1.</span>
                Скачайте HTML-файл нужного модуля (itd.html, estimates.html или business.html)
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--accent)]">2.</span>
                Создайте репозиторий на GitHub и загрузите файл
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--accent)]">3.</span>
                Включите GitHub Pages в настройках репозитория (Settings → Pages → Source: main branch)
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--accent)]">4.</span>
                Готово! Модуль доступен по адресу <code className="px-1.5 py-0.5 bg-[var(--surface-2)] rounded text-xs">https://username.github.io/repo-name/</code>
              </li>
            </ol>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] px-6 py-4 text-center text-xs text-[var(--fg-3)]">
        Бизнес-панель ПСД • Модульная архитектура • React + TypeScript + Tailwind CSS
      </footer>
    </div>
  );
}
