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
    const turn = document.querySelector("input[name='turn']:checked").value;

    matchData.push({ player, opponent, result, turn });
    saveData();
    updateStats();
}

function updateStats() {
    const overall = { win: 0, lose: 0 };
    const turnStats = {
        先攻: { win: 0, lose: 0 },
        後攻: { win: 0, lose: 0 }
    };

    const classStats = {};

    matchData.forEach(match => {
        if (!classStats[match.player]) classStats[match.player] = {};
        if (!classStats[match.player][match.opponent]) {
            classStats[match.player][match.opponent] = {
                win: 0,
                lose: 0,
                先攻: { win: 0, lose: 0 },
                後攻: { win: 0, lose: 0 }
            };
        }

        classStats[match.player][match.opponent][match.result]++;
        classStats[match.player][match.opponent][match.turn][match.result]++;

        overall[match.result]++;
        turnStats[match.turn][match.result]++;

        const opponentCounts = {};
        matchData.forEach(match => {
            opponentCounts[match.opponent] = (opponentCounts[match.opponent] || 0) + 1;
        });

        const totalMatches = matchData.length;
        let opponentRateHtml = "<h3>相手クラスの割合</h3><table><tr><th>クラス</th><th>回数</th><th>割合</th></tr>";
        for (let cls of classes) {
            const count = opponentCounts[cls] || 0;
            const rate = totalMatches ? ((count / totalMatches) * 100).toFixed(1) : 0;
            opponentRateHtml += `<tr><td>${cls}</td><td>${count}</td><td>${rate}%</td></tr>`;
        }
        opponentRateHtml += "</table>";

        // 画面に表示
        document.getElementById("opponentRate").innerHTML = opponentRateHtml;
    });

    // 全体勝率
    const total = overall.win + overall.lose;
    const overallWinRate = total ? ((overall.win / total) * 100).toFixed(1) : 0;

    // 先攻・後攻勝率
    const totalFirst = turnStats.先攻.win + turnStats.先攻.lose;
    const firstWinRate = totalFirst ? ((turnStats.先攻.win / totalFirst) * 100).toFixed(1) : 0;

    const totalSecond = turnStats.後攻.win + turnStats.後攻.lose;
    const secondWinRate = totalSecond ? ((turnStats.後攻.win / totalSecond) * 100).toFixed(1) : 0;

    // 直近10試合の勝率計算
    const recentMatches = matchData.slice(-10);
    const recentWins = recentMatches.filter(m => m.result === "win").length;
    const recentTotal = recentMatches.length;
    const recentWinRate = recentTotal ? ((recentWins / recentTotal) * 100).toFixed(1) : 0;

    document.getElementById("overallStats").textContent =
        `総合: ${overall.win}勝 - ${overall.lose}敗（勝率：${overallWinRate}%）\n` +
        `先攻: ${turnStats.先攻.win}勝 - ${turnStats.先攻.lose}敗（勝率：${firstWinRate}%）\n` +
        `後攻: ${turnStats.後攻.win}勝 - ${turnStats.後攻.lose}敗（勝率：${secondWinRate}%）\n` +
        `直近10試合: ${recentWins}勝 - ${recentTotal - recentWins}敗（勝率：${recentWinRate}%）`;

    // クラス別詳細（相手クラスごとの先攻・後攻勝率も表示）
    let html = "";
    for (let player in classStats) {
        html += `<h3>${player}</h3>
    <table>
      <tr>
        <th>相手クラス</th>
        <th>勝ち</th><th>負け</th><th>勝率</th>
        <th>先攻 勝率</th>
        <th>後攻 勝率</th>
      </tr>`;
        for (let opponent in classStats[player]) {
            const data = classStats[player][opponent];
            const total = data.win + data.lose;
            const rate = total ? ((data.win / total) * 100).toFixed(1) : 0;

            const firstTotal = data.先攻.win + data.先攻.lose;
            const firstRate = firstTotal ? ((data.先攻.win / firstTotal) * 100).toFixed(1) : 0;

            const secondTotal = data.後攻.win + data.後攻.lose;
            const secondRate = secondTotal ? ((data.後攻.win / secondTotal) * 100).toFixed(1) : 0;

            html += `<tr>
          <td>${opponent}</td>
          <td>${data.win}</td>
          <td>${data.lose}</td>
          <td>${rate}%</td>
          <td>${firstRate}%</td>
          <td>${secondRate}%</td>
        </tr>`;
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

function undoLastMatch() {
    if (matchData.length === 0) {
        alert("記録がありません。");
        return;
    }

    if (confirm("直前の記録を取り消しますか？")) {
        matchData.pop(); // 最後の1件を削除
        saveData();
        updateStats();
    }
}

