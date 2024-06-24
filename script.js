let placementCount = 0;

function addTeam() {
  const teamIndex = document.querySelectorAll('.team').length + 1;
  const div = document.createElement('div');
  div.classList.add('team');
  div.id = `team${teamIndex}`;
  div.innerHTML = `
      <label>Team: </label><input type="text" name="teamName">
      <label>Kills: </label><input type="number" name="kills">
      <label>Placement: </label><input type="number" name="placement">
      <button type="button" onclick="removeTeam(${teamIndex})">Remove Team</button>
  `;
  document.getElementById('teams').appendChild(div);
}

function removeTeam(teamIndex) {
  const teamToRemove = document.getElementById(`team${teamIndex}`);
  if (teamToRemove) {
      teamToRemove.parentNode.removeChild(teamToRemove);
  } else {
      console.error(`Team with ID ${teamIndex} not found.`);
  }
}

function addPlacement() {
    placementCount++;
    const div = document.createElement('div');
    div.innerHTML = `
        <label>Placement Points ${placementCount}: </label><input type="number" class="placementPoint" value="0">
    `;
    document.getElementById('placementSettings').appendChild(div);
}

function copyResults() {
    const resultsList = document.getElementById('resultsList');
    const resultsText = Array.from(resultsList.children)
        .map(item => item.textContent)
        .join('\n');
    
    navigator.clipboard.writeText(resultsText)
        .then(() => alert('Results copied to clipboard'))
        .catch(err => console.error('Failed to copy results: ', err));
}

function downloadResults() {
    const resultsList = document.getElementById('resultsList');
    const resultsText = Array.from(resultsList.children)
        .map(item => item.textContent)
        .join('\n');
    
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mich_results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('resultsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const killPoint = parseInt(document.getElementById('killPoint').value);
    const placementPoints = {};
    document.querySelectorAll('.placementPoint').forEach((input, index) => {
        placementPoints[index + 1] = parseInt(input.value);
    });

    const teams = Array.from(document.querySelectorAll('.team')).map(team => {
        return {
            name: team.querySelector('input[name="teamName"]').value,
            kills: parseInt(team.querySelector('input[name="kills"]').value),
            placement: parseInt(team.querySelector('input[name="placement"]').value)
        };
    });

    teams.forEach(team => {
        const kills = team.kills;
        const placement = team.placement;
        const placementScore = placementPoints[placement] || 0;
        const killScore = kills * killPoint;
        team.score = placementScore + killScore;
    });

    teams.sort((a, b) => b.score - a.score);

    // Display results
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    teams.forEach(team => {
        const li = document.createElement('li');
        li.textContent = `${team.name}: ${team.score} points`;
        resultsList.appendChild(li);
    });
});
