import { useState, useEffect, useCallback } from 'react';

// Types
interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  topics: string[];
  homepage: string | null;
}

// Language colors
const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Lua: '#000080',
  R: '#198CE7',
  'Jupyter Notebook': '#DA5B0B',
  Dockerfile: '#384d54',
};

function App() {
  const [username, setUsername] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');

  const fetchProfile = useCallback(async (user: string) => {
    if (!user.trim()) return;
    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`),
      ]);

      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error('Пользователь не найден. Проверьте username.');
        }
        throw new Error(`Ошибка API: ${userRes.status}`);
      }

      const userData: GitHubUser = await userRes.json();
      const reposData: GitHubRepo[] = await reposRes.json();

      setUser(userData);
      setRepos(reposData);
      setUsername(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfile(searchInput.trim());
  };

  // Get unique languages
  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))] as string[];

  // Filter and sort repos
  const filteredRepos = repos
    .filter(r => filterLanguage === 'all' || r.language === filterLanguage)
    .sort((a, b) => {
      switch (sortBy) {
        case 'stars': return b.stargazers_count - a.stargazers_count;
        case 'name': return a.name.localeCompare(b.name);
        case 'updated': return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default: return 0;
      }
    });

  // Load default user on mount
  useEffect(() => {
    fetchProfile('octocat');
    setSearchInput('octocat');
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#161b22] border-b border-[#30363d]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg height="32" viewBox="0 0 16 16" width="32" fill="#c9d1d9">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <h1 className="text-xl font-semibold text-[#c9d1d9] hidden sm:block">GitHub Viewer</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Введите GitHub username..."
                className="w-full px-4 py-2 pl-10 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#8b949e]">Загрузка профиля...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto mt-10 p-6 bg-[#161b22] border border-[#f85149] rounded-lg text-center animate-fade-in">
            <svg className="w-12 h-12 mx-auto text-[#f85149] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-[#f85149] font-medium">{error}</p>
          </div>
        )}

        {/* Profile */}
        {user && !loading && (
          <div className="animate-fade-in">
            {/* Profile Card */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Avatar & Info */}
              <div className="md:w-72 flex-shrink-0">
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-[#30363d] hover:border-[#58a6ff] transition-colors mx-auto md:mx-0"
                  />
                </a>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-[#c9d1d9]">
                    {user.name || user.login}
                  </h2>
                  <p className="text-xl text-[#8b949e]">{user.login}</p>
                </div>

                {user.bio && (
                  <p className="text-[#c9d1d9] mb-4 text-lg">{user.bio}</p>
                )}

                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-[#c9d1d9] text-sm font-medium hover:bg-[#30363d] hover:border-[#8b949e] transition-colors mb-4"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                  Открыть на GitHub
                </a>

                <div className="flex flex-wrap gap-4 mt-4 text-[#8b949e]">
                  {user.company && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {user.company}
                    </span>
                  )}
                  {user.location && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {user.location}
                    </span>
                  )}
                  {user.blog && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">
                        {user.blog}
                      </a>
                    </span>
                  )}
                  {user.twitter_username && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">
                        @{user.twitter_username}
                      </a>
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-1 text-[#8b949e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-semibold text-[#c9d1d9]">{user.followers}</span> followers
                  </div>
                  <div className="flex items-center gap-1 text-[#8b949e]">
                    <span className="font-semibold text-[#c9d1d9]">{user.following}</span> following
                  </div>
                  <div className="flex items-center gap-1 text-[#8b949e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="font-semibold text-[#c9d1d9]">{user.public_repos}</span> repos
                  </div>
                </div>

                <p className="text-[#8b949e] text-sm mt-4">
                  На GitHub с {new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Repos Section */}
            <div className="border-t border-[#30363d] pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-semibold text-[#c9d1d9]">
                  Репозитории <span className="text-[#8b949e] font-normal">({filteredRepos.length})</span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars' | 'name')}
                    className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-[#c9d1d9] text-sm focus:outline-none focus:border-[#58a6ff]"
                  >
                    <option value="updated">По обновлению</option>
                    <option value="stars">По звёздам</option>
                    <option value="name">По имени</option>
                  </select>

                  {/* Language filter */}
                  {languages.length > 0 && (
                    <select
                      value={filterLanguage}
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-[#c9d1d9] text-sm focus:outline-none focus:border-[#58a6ff]"
                    >
                      <option value="all">Все языки</option>
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Repo List */}
              <div className="space-y-4">
                {filteredRepos.map((repo, index) => (
                  <div
                    key={repo.id}
                    className="p-4 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-[#58a6ff] transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#58a6ff] font-semibold text-lg hover:underline"
                          >
                            {repo.name}
                          </a>
                          {repo.fork && (
                            <span className="text-xs px-2 py-0.5 border border-[#30363d] rounded-full text-[#8b949e]">
                              Fork
                            </span>
                          )}
                        </div>

                        {repo.description && (
                          <p className="text-[#8b949e] mt-1 text-sm">{repo.description}</p>
                        )}

                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {repo.topics.map(topic => (
                              <span
                                key={topic}
                                className="px-2 py-0.5 bg-[#388bfd26] text-[#58a6ff] rounded-full text-xs font-medium"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#8b949e]">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: languageColors[repo.language] || '#8b949e' }}
                              ></span>
                              {repo.language}
                            </span>
                          )}
                          {repo.stargazers_count > 0 && (
                            <a href={`${repo.html_url}/stargazers`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#58a6ff]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              {repo.stargazers_count}
                            </a>
                          )}
                          {repo.forks_count > 0 && (
                            <a href={`${repo.html_url}/network/members`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#58a6ff]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              {repo.forks_count}
                            </a>
                          )}
                          <span>
                            Обновлено {formatRelativeTime(repo.updated_at)}
                          </span>
                        </div>
                      </div>

                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 border border-[#30363d] rounded-md text-[#8b949e] text-xs hover:text-[#58a6ff] hover:border-[#58a6ff] transition-colors whitespace-nowrap"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Демо
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredRepos.length === 0 && !loading && (
                <div className="text-center py-12 text-[#8b949e]">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <p>Репозитории не найдены</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!user && !loading && !error && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-[#30363d] mb-6" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <h2 className="text-2xl font-semibold text-[#c9d1d9] mb-2">GitHub Profile Viewer</h2>
            <p className="text-[#8b949e] max-w-md mx-auto">
              Введите GitHub username в поисковую строку выше, чтобы просмотреть профиль и репозитории
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] mt-12 py-6 text-center text-[#8b949e] text-sm">
        <p>GitHub Profile Viewer • Использует GitHub REST API</p>
      </footer>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} мес. назад`;
  return `${Math.floor(diffDays / 365)} г. назад`;
}

export default App;
