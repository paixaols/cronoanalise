function parseDate(dateString){
    let dia = dateString.split(', ')[0].split('/')[0]
    let mes = dateString.split(', ')[0].split('/')[1]
    let ano = dateString.split(', ')[0].split('/')[2]
    let hora = dateString.split(', ')[1].split(':')[0]
    let min = dateString.split(', ')[1].split(':')[1]
    let seg = dateString.split(', ')[1].split(':')[2]
    return new Date(ano, mes-1, dia, hora, min, seg)
}

const data = JSON.parse(localStorage.getItem('items'))
var etapas = []
var tempos = []
var tObs = 0
var ciclos = 0
const primeiraEtapa = data[0][1]
var inicioCiclo, fimCiclo

for(let i = 0; i < data.length-1; i++){// data[i]: 0 -> timestring, 1 -> descrição da etapa.
    let inicioEtapa = parseDate(data[i][0])
    let fimEtapa = parseDate(data[i+1][0])
    let etapa = data[i][1]
    if(etapa == primeiraEtapa){
        ciclos++
    }
    let index = etapas.indexOf(etapa)
    if(index >= 0){
        tempos[index].push((fimEtapa-inicioEtapa)/(1000*60))// Tempos inicialmente em ms.
    }else{
        if(etapa == 'fim'){
            continue
        }
        etapas.push(etapa)
        tempos.push([(fimEtapa-inicioEtapa)/(1000*60)])
    }
}
var inicioProcesso = parseDate(data[0][0])
var fimProcesso = parseDate(data[data.length-1][0])
var tObs = (fimProcesso-inicioProcesso)/ciclos// Tempo observado em ms.
tObs /= (1000*60)// Tempo observado em min.

var labels = []
for(let i = 1; i <= tempos[0].length; i++){
    labels.push(i)
}

const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(52, 179, 96, 1)', 'rgba(152, 36, 201, 1)', 'rgba(255, 187, 0, 1)', 'rgba(230, 0, 0, 1)', 'rgba(14, 0, 171, 1)', 'rgba(65, 125, 0, 1)']
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(52, 179, 96, 0.2)', 'rgba(152, 36, 201, 0.2)', 'rgba(255, 187, 0, 0.2)', 'rgba(230, 0, 0, 0.2)', 'rgba(14, 0, 171, 0.2)', 'rgba(65, 125, 0, 0.2)']

var datasets = []
for(let i in etapas){
    datasets.push({
        label: etapas[i],
        data: tempos[i],
        borderWidth: 5,
        borderColor: borderColors[i%borderColors.length],
        backgroundColor: borderColors[i%borderColors.length],
        // backgroundColor: backgroundColors[i%backgroundColors.length],
    })
}

const ctx = document.getElementById('chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ciclos'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Tempo (min)'
                }
            }
        }
    }
});

var txtTempoObs = document.querySelector('#tobservado')
var txtTempoNormal = document.querySelector('#tnormal')
var txtTempoPadrao = document.querySelector('#tpadrao')
var ritmo = document.querySelector('#ritmo')
var tol = document.querySelector('#tolerancia')
txtTempoObs.innerHTML = 'Tempo observado:' + ` ${tObs.toFixed(1)}` + ' min'
function evalTimes(){
    var tNormal = tObs*Number(ritmo.value)/100
    var tPadrao = tNormal*(1+Number(tol.value)/100)
    txtTempoNormal.innerHTML = 'Tempo normal:' + ` ${tNormal.toFixed(1)}` + ' min'
    txtTempoPadrao.innerHTML = 'Tempo padrão:' + ` ${tPadrao.toFixed(1)}` + ' min'
}
ritmo.addEventListener('input', evalTimes)
tol.addEventListener('input', evalTimes)
