<?php
session_start();
include 'db.php';

// Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: signin.php');
    exit();
}

$user_id = $_SESSION['user_id'];

/*
 If request is an AJAX fetch for stats, return JSON and exit.
 Frontend calls: profile.php?action=fetch&range=all|7|30
*/
if (isset($_GET['action']) && $_GET['action'] === 'fetch') {
    $range = isset($_GET['range']) ? $_GET['range'] : 'all';

    // Build date condition
    $dateCondition = "";
    if ($range === '7') {
        $dateCondition = "AND test_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    } elseif ($range === '30') {
        $dateCondition = "AND test_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    } // 'all' => no extra condition

    // Overview stats
    $overviewSql = "
        SELECT 
            AVG(wpm) AS avg_wpm,
            MAX(wpm) AS best_wpm,
            AVG(accuracy) AS avg_accuracy,
            AVG(consistency) AS avg_consistency,
            MAX(level) AS highest_level,
            COUNT(*) AS total_tests,
            AVG(test_duration) AS avg_duration
        FROM user_typing_stats
        WHERE user_id = ? $dateCondition
    ";
    $stmt = $conn->prepare($overviewSql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $overview = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    // Trend: average wpm per date (limit to last 60 days if all-time large)
    $trendSql = "
        SELECT test_date, AVG(wpm) AS avg_wpm
        FROM user_typing_stats
        WHERE user_id = ? $dateCondition
        GROUP BY test_date
        ORDER BY test_date ASC
    ";
    $stmt = $conn->prepare($trendSql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $trendRes = $stmt->get_result();
    $trend = [];
    while ($r = $trendRes->fetch_assoc()) {
        $trend[] = $r;
    }
    $stmt->close();

    // Recent tests (filtered by same range), latest first
    $recentSql = "
        SELECT id, wpm, accuracy, consistency, level, test_duration, test_date
        FROM user_typing_stats
        WHERE user_id = ? $dateCondition
        ORDER BY test_date DESC, id DESC
        LIMIT 10
    ";
    $stmt = $conn->prepare($recentSql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $recentRes = $stmt->get_result();
    $recent = [];
    while ($r = $recentRes->fetch_assoc()) {
        $recent[] = $r;
    }
    $stmt->close();

    // Streak calculation (consecutive days with at least one test) - for the selected range
    // We'll compute by selecting distinct test_date ordered desc and checking consecutive dates
    $streakSql = "
        SELECT DISTINCT test_date
        FROM user_typing_stats
        WHERE user_id = ? $dateCondition
        ORDER BY test_date DESC
    ";
    $stmt = $conn->prepare($streakSql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $datesRes = $stmt->get_result();
    $dates = [];
    while ($d = $datesRes->fetch_assoc()) {
        $dates[] = $d['test_date'];
    }
    $stmt->close();

    $streak = 0;
    if (!empty($dates)) {
        $today = new DateTime($dates[0]);
        $streak = 1;
        for ($i = 1; $i < count($dates); $i++) {
            $curr = new DateTime($dates[$i]);
            $diff = $today->diff($curr)->days;
            if ($diff === 1) {
                $streak++;
                $today = $curr;
            } else {
                break;
            }
        }
    }

    // Return JSON
    header('Content-Type: application/json');
    echo json_encode([
        'overview' => $overview,
        'trend' => $trend,
        'recent' => $recent,
        'streak' => $streak
    ]);
    $conn->close();
    exit();
}

// --- Normal page render (first load: fetch user info and initial overview/all-time stats) ---

// User info
$user_stmt = $conn->prepare("SELECT full_name, username, email, created_at FROM users WHERE id = ?");
$user_stmt->bind_param("i", $user_id);
$user_stmt->execute();
$user = $user_stmt->get_result()->fetch_assoc();
$user_stmt->close();

// Compute initials and display name variables
$full_name = $user['full_name'] ?? $user['username'] ?? 'User';
$initials = '';
foreach (explode(' ', trim($full_name)) as $part) {
    if ($part !== '') $initials .= strtoupper($part[0]);
    if (strlen($initials) >= 2) break;
}
$name = $full_name;

// For initial render, fetch "All time" overview + recent 10
$overviewSql = "
    SELECT 
        AVG(wpm) AS avg_wpm,
        MAX(wpm) AS best_wpm,
        AVG(accuracy) AS avg_accuracy,
        AVG(consistency) AS avg_consistency,
        MAX(level) AS highest_level,
        COUNT(*) AS total_tests,
        AVG(test_duration) AS avg_duration
    FROM user_typing_stats
    WHERE user_id = ?
";
$stmt = $conn->prepare($overviewSql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$overview = $stmt->get_result()->fetch_assoc();
$stmt->close();

$recentSql = "
    SELECT id, wpm, accuracy, consistency, level, test_duration, test_date
    FROM user_typing_stats
    WHERE user_id = ?
    ORDER BY test_date DESC, id DESC
    LIMIT 10
";
$stmt = $conn->prepare($recentSql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$recentRes = $stmt->get_result();
$recent = [];
while ($r = $recentRes->fetch_assoc()) {
    $recent[] = $r;
}
$stmt->close();

// Compute overall streak (all-time consecutive days up to latest date)
$streakSql = "
    SELECT DISTINCT test_date
    FROM user_typing_stats
    WHERE user_id = ?
    ORDER BY test_date DESC
";
$stmt = $conn->prepare($streakSql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$datesRes = $stmt->get_result();
$dates = [];
while ($d = $datesRes->fetch_assoc()) {
    $dates[] = $d['test_date'];
}
$stmt->close();

$streak = 0;
if (!empty($dates)) {
    $today = new DateTime($dates[0]);
    $streak = 1;
    for ($i = 1; $i < count($dates); $i++) {
        $curr = new DateTime($dates[$i]);
        $diff = $today->diff($curr)->days;
        if ($diff === 1) {
            $streak++;
            $today = $curr;
        } else {
            break;
        }
    }
}

// Close connection for now; AJAX handler re-opens as needed (we closed earlier on fetch path)
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Profile - PolyType</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <style>
        :root { --primary: #6366f1; --primary-dark: #4f46e5; --secondary: #f59e0b; }
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }
        .dark body { background-color: #0f172a; color: #f1f5f9; }
        .progress-ring__circle { transition: stroke-dashoffset 0.3s; transform: rotate(-90deg); transform-origin: 50% 50%; }
        .skill-meter { height: 8px; border-radius: 4px; background-color: #e2e8f0; overflow: hidden; }
        .skill-progress { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.5s ease; }
    </style>

    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="min-h-screen bg-gray-50 text-gray-800 dark:bg-slate-900 dark:text-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm dark:bg-slate-800 dark:text-gray-100">
        <div class="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <i class="fas fa-keyboard text-2xl text-primary"></i>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Poly<span class="text-primary">Type</span></h1>
            </div>

            <nav>
                <ul class="flex space-x-6">
                    <li><a href="index.html" class="text-gray-600 hover:text-primary transition dark:text-gray-300">Home</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-primary transition dark:text-gray-300">Practice</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-primary transition dark:text-gray-300">Tests</a></li>
                    <li><a href="profile.php" class="text-primary font-semibold">Profile</a></li>
                </ul>
            </nav>

            <div class="flex items-center space-x-4">
                <button id="theme-toggle" class="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700 transition">
                    <i id="theme-icon" class="fas fa-moon"></i>
                </button>

                <div class="relative">
                    <button id="user-menu-button" class="flex items-center space-x-2 focus:outline-none">
                        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold"><?php echo htmlspecialchars($initials); ?></div>
                        <span class="hidden md:inline"><?php echo htmlspecialchars($name); ?></span>
                        <i class="fas fa-chevron-down text-xs"></i>
                    </button>
                    <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 dark:bg-slate-700">
                        <a href="profile.php" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200">Your Profile</a>
                        <a href="logout.php" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200">Sign out</a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main -->
    <main class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar -->
            <aside class="lg:w-1/4">
                <div class="bg-white rounded-xl shadow-sm p-6 dark:bg-slate-800">
                    <div class="flex flex-col items-center mb-6">
                        <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold mb-4"><?php echo htmlspecialchars($initials); ?></div>
                        <h2 class="text-xl font-bold"><?php echo htmlspecialchars($name); ?></h2>
                        <p class="text-gray-500 dark:text-gray-400">@<?php echo htmlspecialchars(strtolower($user['username'])); ?></p>
                        <p class="text-sm text-gray-500 mt-1"><?php echo htmlspecialchars($user['email']); ?></p>
                        <div class="mt-2 flex space-x-2">
                            <span class="badge bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"><i class="fas fa-trophy mr-1"></i> Member</span>
                            <span class="badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm"><i class="fas fa-fire mr-1"></i> <?php echo (int)$streak; ?>-day</span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Typing Level</span>
                                <span class="text-sm font-medium"><?php echo htmlspecialchars($overview['highest_level'] ?? 1); ?></span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
                                <?php $wpmPct = min(100, round($overview['avg_wpm'] ?? 0)); ?>
                                <div class="bg-primary h-2 rounded-full" style="width: <?php echo $wpmPct; ?>%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Tests Completed</span>
                                <span class="text-sm font-medium"><?php echo (int)($overview['total_tests'] ?? 0); ?></span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
                                <div class="bg-green-500 h-2 rounded-full" style="width: <?php echo min(100, (int)$overview['total_tests']); ?>%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Average WPM</span>
                                <span class="text-sm font-medium"><?php echo round($overview['avg_wpm'] ?? 0); ?></span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
                                <div class="bg-blue-500 h-2 rounded-full" style="width: <?php echo $wpmPct; ?>%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                        <h3 class="font-semibold mb-3">Skills</h3>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Speed</span>
                                    <span><?php echo round($overview['avg_wpm'] ?? 0); ?> WPM</span>
                                </div>
                                <div class="skill-meter">
                                    <div class="skill-progress" style="width: <?php echo $wpmPct; ?>%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Accuracy</span>
                                    <span><?php echo round($overview['avg_accuracy'] ?? 0); ?>%</span>
                                </div>
                                <div class="skill-meter">
                                    <div class="skill-progress" style="width: <?php echo round($overview['avg_accuracy'] ?? 0); ?>%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span>Consistency</span>
                                    <span><?php echo round($overview['avg_consistency'] ?? 0); ?>%</span>
                                </div>
                                <div class="skill-meter">
                                    <div class="skill-progress" style="width: <?php echo round($overview['avg_consistency'] ?? 0); ?>%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main content -->
            <section class="lg:w-3/4">
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6 dark:bg-slate-800">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold">Overview</h2>
                        <div class="flex items-center space-x-3">
                            <label class="text-sm text-gray-500">Show:</label>
                            <select id="range-select" class="border rounded-md px-3 py-2">
                                <option value="all">All time</option>
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                            </select>
                        </div>
                    </div>

                    <!-- Overview cards -->
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-500">Avg WPM</div>
                            <div id="card-avg-wpm" class="text-2xl font-bold text-indigo-600"><?php echo round($overview['avg_wpm'] ?? 0); ?></div>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-500">Best WPM</div>
                            <div id="card-best-wpm" class="text-2xl font-bold text-green-600"><?php echo round($overview['best_wpm'] ?? 0); ?></div>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-500">Accuracy</div>
                            <div id="card-avg-accuracy" class="text-2xl font-bold text-green-600"><?php echo round($overview['avg_accuracy'] ?? 0); ?>%</div>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-500">Consistency</div>
                            <div id="card-avg-consistency" class="text-2xl font-bold text-blue-600"><?php echo round($overview['avg_consistency'] ?? 0); ?>%</div>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-500">Tests</div>
                            <div id="card-tests" class="text-2xl font-bold text-purple-600"><?php echo (int)$overview['total_tests']; ?></div>
                        </div>
                    </div>

                    <!-- Chart -->
                    <div>
                        <canvas id="wpmChart" height="120"></canvas>
                    </div>
                </div>

                <!-- Recent Tests -->
                <div class="bg-white rounded-xl shadow-sm p-6 dark:bg-slate-800">
                    <h3 class="text-lg font-semibold mb-4">Recent Tests</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead class="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WPM</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consistency</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                </tr>
                            </thead>
                            <tbody id="recent-body" class="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                                <?php if (!empty($recent)): ?>
                                    <?php foreach ($recent as $r): ?>
                                        <tr>
                                            <td class="px-6 py-3 text-sm"><?php echo date('d M Y', strtotime($r['test_date'])); ?></td>
                                            <td class="px-6 py-3 text-sm"><?php echo (int)$r['wpm']; ?></td>
                                            <td class="px-6 py-3 text-sm"><?php echo (int)$r['accuracy']; ?>%</td>
                                            <td class="px-6 py-3 text-sm"><?php echo (int)$r['consistency']; ?>%</td>
                                            <td class="px-6 py-3 text-sm"><?php echo (int)$r['level']; ?></td>
                                            <td class="px-6 py-3 text-sm"><?php echo (int)$r['test_duration']; ?> min</td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6" class="text-center py-4 text-gray-500">No tests found</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>
        </div>
    </main>

    <footer class="bg-white border-t mt-12 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200">
        <div class="container mx-auto px-4 py-6">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center space-x-2 mb-4 md:mb-0">
                    <i class="fas fa-keyboard text-xl text-primary"></i>
                    <span class="text-lg font-bold">Poly<span class="text-primary">Type</span></span>
                </div>
                <div class="flex space-x-6">
                    <a href="about.html" class="text-gray-600 hover:text-primary transition dark:text-gray-400">About</a>
                    <a href="privacy.html" class="text-gray-600 hover:text-primary transition dark:text-gray-400">Privacy</a>
                    <a href="#" class="text-gray-600 hover:text-primary transition dark:text-gray-400">Terms</a>
                    <a href="contact.html" class="text-gray-600 hover:text-primary transition dark:text-gray-400">Contact</a>
                </div>
            </div>
            <div class="mt-6 text-center text-gray-500 text-sm dark:text-gray-400">&copy; <?php echo date('Y'); ?> PolyType. All rights reserved.</div>
        </div>
    </footer>

<script>
    // Theme toggle (simple)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    function setDark(dark) {
        if (dark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
    // persist theme in localStorage
    const savedTheme = localStorage.getItem('pt_theme') || 'light';
    setDark(savedTheme === 'dark');
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('pt_theme', isDark ? 'dark' : 'light');
        setDark(isDark);
    });

    // user dropdown
    const userBtn = document.getElementById('user-menu-button');
    const userDrop = document.getElementById('user-dropdown');
    userBtn.addEventListener('click', () => userDrop.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
        if (!userBtn.contains(e.target) && !userDrop.contains(e.target)) userDrop.classList.add('hidden');
    });

    // Chart setup
    let wpmChart = null;
    function createChart(labels = [], data = []) {
        const ctx = document.getElementById('wpmChart').getContext('2d');
        if (wpmChart) wpmChart.destroy();
        wpmChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Avg WPM',
                    data: data,
                    fill: true,
                    tension: 0.25,
                    borderWidth: 2,
                    pointRadius: 3,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.08)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true },
                    y: { display: true, beginAtZero: true }
                }
            }
        });
    }

    // Fetch and render data for selected range
    async function fetchAndRender(range = 'all') {
        const url = `profile.php?action=fetch&range=${encodeURIComponent(range)}`;
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) return;
        const json = await res.json();

        const ov = json.overview || {};
        document.getElementById('card-avg-wpm').textContent = Math.round(ov.avg_wpm || 0);
        document.getElementById('card-best-wpm').textContent = Math.round(ov.best_wpm || 0);
        document.getElementById('card-avg-accuracy').textContent = Math.round(ov.avg_accuracy || 0) + '%';
        document.getElementById('card-avg-consistency').textContent = Math.round(ov.avg_consistency || 0) + '%';
        document.getElementById('card-tests').textContent = (ov.total_tests || 0);

        // Trend chart
        const trend = json.trend || [];
        const labels = trend.map(t => t.test_date);
        const data = trend.map(t => Math.round(t.avg_wpm));
        createChart(labels, data);

        // Recent table
        const recentBody = document.getElementById('recent-body');
        recentBody.innerHTML = '';
        if ((json.recent || []).length === 0) {
            recentBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">No tests found</td></tr>';
        } else {
            for (const r of json.recent) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-3 text-sm">${(new Date(r.test_date)).toLocaleDateString()}</td>
                    <td class="px-6 py-3 text-sm">${r.wpm}</td>
                    <td class="px-6 py-3 text-sm">${r.accuracy}%</td>
                    <td class="px-6 py-3 text-sm">${r.consistency}%</td>
                    <td class="px-6 py-3 text-sm">${r.level}</td>
                    <td class="px-6 py-3 text-sm">${r.test_duration} min</td>
                `;
                recentBody.appendChild(tr);
            }
        }
    }

    // Hook range dropdown
    const rangeSelect = document.getElementById('range-select');
    rangeSelect.addEventListener('change', () => fetchAndRender(rangeSelect.value));

    // initial chart render (use server-fetched initial data by calling fetch with 'all' so chart builds)
    fetchAndRender('all');

</script>
</body>
</html>

