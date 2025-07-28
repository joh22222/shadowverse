const classes = ["エルフ", "ロイヤル", "ウィッチ", "ドラゴン", "ナイトメア", "ビショップ", "ネメシス"];
let matchData = [];

window.onload = () => {
    const playerClassSelect = document.getElementById("playerClass");
    const opponentClassSelect = document.getElementById("opponentClass");

    classes.forEach(cls => {
        const opt1 = document.createElement("option");
        opt1.value = cls;
        opt1.text = cls;
        playerClassSelect.add(opt1);

        const opt2 = document.createElement("option");
        opt2.value = cls;
        opt2.text = cls;
        opponentClassSelect.add(opt2);
    });

    loadData();
    updateStats();
};

function recordMatch() {
    const player = document.getElementById("playerClass").value;
    const opponent = document.getElementById("opponentClass").value;
    const result = document.querySelector("input[name='result']:checked").value;


    matchData.push({ player, opponent, result });
    saveData();
    updateStats();
}

function updateStats() {
    const overall = { win: 0, lose: 0 };
    const classStats = {};

    matchData.forEach(match => {
        if (!classStats[match.player]) classStats[match.player] = {};
        if (!classStats[match.player][match.opponent]) classStats[match.player][match.opponent] = { win: 0, lose: 0 };

        classStats[match.player][match.opponent][match.result]++;
        overall[match.result]++;
    });

    const total = overall.win + overall.lose;
    const overallWinRate = total ? ((overall.win / total) * 100).toFixed(1) : 0;

    document.getElementById("overallStats").textContent =
        `${overall.win}勝 - ${overall.lose}敗（勝率：${overallWinRate}%）`;

    let html = "";
    for (let player in classStats) {
        html += `<h3>${player}</h3><table><tr><th>相手クラス</th><th>勝ち</th><th>負け</th><th>勝率</th></tr>`;
        for (let opponent in classStats[player]) {
            const data = classStats[player][opponent];
            const total = data.win + data.lose;
            const rate = total ? ((data.win / total) * 100).toFixed(1) : 0;
            html += `<tr><td>${opponent}</td><td>${data.win}</td><td>${data.lose}</td><td>${rate}%</td></tr>`;
        }
        html += `</table>`;
    }
    document.getElementById("detailedStats").innerHTML = html;
}

function saveData() {
    localStorage.setItem("sv_match_data", JSON.stringify(matchData));
}

function loadData() {
    const saved = localStorage.getItem("sv_match_data");
    if (saved) {
        matchData = JSON.parse(saved);
    }
}

function resetData() {
    if (confirm("全データをリセットしますか？")) {
        matchData = [];
        localStorage.removeItem("sv_match_data");
        updateStats();
    }
}
