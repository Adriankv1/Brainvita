// Initial tilstand av brettet
const initialBoard = [
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1]
];

const boardElement = document.getElementById("board");
let board = JSON.parse(JSON.stringify(initialBoard)); // Kopi av brettet
let selectedPeg = null; // Holder styr på hvilken brikke som er valgt

// Hent popup-elementer
const popup = document.getElementById("popup");
const closePopupButton = document.getElementById("close-popup");
const tryAgainButton = document.getElementById("try-again");

// Funksjon for å vise popup
function showPopup() {
    popup.classList.remove("hidden");
}

// Funksjon for å skjule popup
closePopupButton.addEventListener("click", function() {
    popup.classList.add("hidden");
});

// Funksjon for å tilbakestille brettet til dets opprinnelige tilstand
function resetGame() {
    board = JSON.parse(JSON.stringify(initialBoard)); // Tilbakestill brettet
    selectedPeg = null; // Nullstill valgt brikke
    renderBoard(); // Tegn brettet på nytt
    popup.classList.add("hidden"); // Skjul popup-en
}

// Legg til klikkhendelse på "Try Again"-knappen for å starte spillet på nytt
tryAgainButton.addEventListener("click", function() {
    resetGame();
});

// Funksjon for å tegne brettet
function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (board[row][col] === 1) {
                cell.classList.add("peg");
                // Hvis denne brikken er valgt, gi den klassen "selected"
                if (selectedPeg && selectedPeg[0] === row && selectedPeg[1] === col) {
                    cell.classList.add("selected");
                }
            } else if (board[row][col] === 0) {
                cell.classList.add("empty");
            } else {
                cell.classList.add("invalid");
            }

            // Legg til klikkhendelse på hver celle
            cell.addEventListener("click", function () {
                handleCellClick(row, col);
            });

            boardElement.appendChild(cell);
        }
    }
}

// Sjekker om trekket er gyldig
function isValidMove(fromRow, fromCol, toRow, toCol) {
    console.log(`Checking move from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`); // Debugging

    // Sjekk om målcellen er innenfor brettet
    if (toRow < 0 || toRow >= board.length || toCol < 0 || toCol >= board[0].length) {
        return false; // Ugyldig bevegelse
    }

    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;

    // Sjekk om målcellen er tom og at midtcellen inneholder en brikke
    if (board[toRow][toCol] === 0 && board[middleRow][middleCol] === 1) {
        // Sjekk om trekket er enten 2 plasser horisontalt eller 2 plasser vertikalt
        if (Math.abs(fromRow - toRow) === 2 && fromCol === toCol) return true;
        if (Math.abs(fromCol - toCol) === 2 && fromRow === toRow) return true;
    }
    return false;
}

// Funksjon for å sjekke om det finnes flere mulige trekk på brettet
function hasValidMoves() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 1) { // Finn alle brikker
                // Sjekk om brikken har et gyldig trekk i noen retning
                if (isValidMove(row, col, row - 2, col) ||  // Opp
                    isValidMove(row, col, row + 2, col) ||  // Ned
                    isValidMove(row, col, row, col - 2) ||  // Venstre
                    isValidMove(row, col, row, col + 2)) {  // Høyre
                    return true;  // Fant et gyldig trekk
                }
            }
        }
    }
    return false; // Ingen gyldige trekk igjen
}

// Håndterer klikk på celler
function handleCellClick(row, col) {
    // Hvis en peg er valgt
    if (selectedPeg) {
        // Sjekk om spilleren klikker på den samme pegen
        const [fromRow, fromCol] = selectedPeg;
        if (fromRow === row && fromCol === col) {
            // Deselect peg hvis klikket er på den samme
            selectedPeg = null;
        } else if (isValidMove(fromRow, fromCol, row, col)) {
            // Hvis en annen peg er valgt, prøv å flytte den
            // Utfør trekket
            board[fromRow][fromCol] = 0; // Fjern brikken fra den opprinnelige posisjonen
            board[row][col] = 1; // Plasser brikken i den nye posisjonen
            board[(fromRow + row) / 2][(fromCol + col) / 2] = 0; // Fjern brikken som blir hoppet over
            selectedPeg = null; // Tilbakestill valgt brikke

            // Sjekk om det finnes flere gyldige trekk igjen etter trekket
            if (!hasValidMoves()) {
                showPopup(); // Hvis det ikke finnes flere gyldige trekk, vis popup
            }
        }
    } else if (board[row][col] === 1) {
        // Hvis spilleren klikker på en peg, velg den
        selectedPeg = [row, col];
    }

    renderBoard(); // Oppdater brettet etter hver handling
}
// Kall renderBoard for å tegne brettet ved oppstart
renderBoard();
