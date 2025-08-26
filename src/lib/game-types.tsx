export type GameState =
  | "idle"
  | "setup"
  | "reveal"
  | "preRound"
  | "speaking"
  | "discussion"
  | "voting"
  | "roundResult"
  | "gameOver"

export interface Player {
  id: string
  name: string
  isEliminated: boolean
  isJorge: boolean
  avatar?: string
}

export interface GameSettings {
  turnSeconds: number
  discussionSeconds: number
  category: string
  customWord?: string
  sounds: boolean
}

export interface Round {
  number: number
  speakingOrder: string[]
  baseWord: string
  votes: Record<string, string>
}

export interface GameData {
  state: GameState
  players: Player[]
  settings: GameSettings
  currentRound?: Round
  rounds: Round[]
}

// export const WORD_CATEGORIES = ["viagem", "casa", "livro", "música", "filme", "comida", "trabalho", "família", "praia", "montanha", "cidade", "hotel", "avião", "mala", "mapa", "férias", "pizza", "massa", "salada", "sobremesa", "restaurante", "cozinha", "receita", "sabor", "filme", "ator", "cinema", "pipocas", "bilhete", "ecrã", "história", "personagem", "reunião", "projeto", "equipa", "escritório", "computador", "prazo", "cliente", "apresentação", "futebol", "ténis", "natação", "ginásio", "corrida", "equipa", "vitória", "treino", "telemóvel", "computador", "internet", "aplicação", "website", "software", "dados", "rede"]

export const WORD_CATEGORIES = {
  Geral: [
    "viagem", "casa", "livro", "música", "filme", "comida", "trabalho", "família", "amizade", "festa",
    "escola", "rua", "praça", "jardim", "carro", "autocarro", "comboio", "metro", "bicicleta", "motocicleta",
    "mar", "rio", "montanha", "sol", "chuva", "vento", "neve", "cidade", "aldeia", "vizinhança",
    "telefone", "telemóvel", "mensagem", "fotografia", "relógio", "porta", "janela", "chave", "sapato", "camisa",
    "casaco", "cadeira", "mesa", "sofá", "lâmpada", "computador", "planta", "animal", "café", "chá",
  ],
  Viagens: [
    "praia", "montanha", "cidade", "hotel", "avião", "mala", "mapa", "férias", "passaporte", "bilhete",
    "check-in", "embarque", "porta de embarque", "destino", "origem", "escala", "transfer", "aluguer de carro", "alojamento", "hostel",
    "pousada", "resort", "guia", "excursão", "roteiro", "mochila", "carregador", "adaptador", "seguro de viagem", "vistos",
    "alfândega", "fronteira", "bagagem de mão", "bagagem de porão", "terminal", "partidas", "chegadas", "janela", "corredor", "apoio de cabeça",
    "jet lag", "táxi", "aplicação de mapas", "GPS", "prazo de validade do passaporte", "cartão de embarque", "portão", "lugares", "turista", "ponto turístico",
    "miradouro", "carteira", "câmbio", "souvenir", "host family", "check-out", "receção", "balcão de informação", "fuso horário", "itinerário"
  ],
  Comida: [
    "pizza", "massa", "salada", "sobremesa", "restaurante", "cozinha", "receita", "sabor", "arroz", "feijão",
    "bacalhau", "sardinha", "carne", "frango", "porco", "vaca", "ovos", "queijo", "pão", "azeite",
    "manteiga", "tomate", "cebola", "alho", "batata", "sopa", "caldo", "pimento", "couve", "brócolos",
    "espinafres", "fruta", "maçã", "banana", "laranja", "morangos", "uva", "pera", "melão", "melancia",
    "ananás", "limão", "doce", "bolo", "tarte", "gelado", "chocolate", "café", "chá", "vinho"
  ],
  Cinema: [
    "filme", "ator", "cinema", "pipocas", "bilhete", "ecrã", "história", "personagem", "realizador", "argumento",
    "montagem", "banda sonora", "trailer", "estreia", "cartaz", "sessão", "cadeiras", "projeção", "curta-metragem", "longa-metragem",
    "documentário", "animação", "dobragem", "legenda", "género", "drama", "comédia", "ação", "romance", "terror",
    "thriller", "ficção científica", "fantasia", "biografia", "guionismo", "plateau", "cena", "take", "ensaio", "figurino",
    "maquilhagem", "luz", "som", "câmara", "claquete", "créditos", "bilheteira", "estúdio", "franquia", "sequela"
  ],
  Trabalho: [
    "reunião", "projeto", "equipa", "escritório", "computador", "prazo", "cliente", "apresentação", "fatura", "contrato",
    "proposta", "orçamento", "relatório", "email", "calendário", "agenda", "tarefa", "prioridade", "gestão", "supervisor",
    "colega", "recrutamento", "entrevista", "formação", "remoto", "presencial", "híbrido", "salário", "benefícios", "folha de horas",
    "horário", "turno", "pausa", "férias", "licença", "avaliação", "objetivos", "meta", "feedback", "brainstorming",
    "quadro branco", "kanban", "scrum", "sprint", "deploy", "servidor", "rede", "impressora", "secretária", "cadeira ergonómica"
  ],
  Desporto: [
    "futebol", "ténis", "natação", "ginásio", "corrida", "equipa", "vitória", "treino", "derrota", "empate",
    "árbitro", "estádio", "baliza", "bola", "raquete", "piscina", "pódio", "medalha", "campeonato", "torneio",
    "liga", "tática", "defesa", "ataque", "meio-campo", "guarda-redes", "marcador", "golo", "penálti", "livre",
    "canto", "maratona", "sprint", "alongamentos", "flexões", "abdominais", "musculação", "tapete", "bicicleta estática", "esteira",
    "treinador", "nutrição", "hidratação", "lesão", "fisioterapia", "aquecimento", "arrefecimento", "cronómetro", "apito", "marcador eletrónico"
  ],
  Tecnologia: [
    "telemóvel", "computador", "internet", "aplicação", "website", "software", "dados", "rede", "router", "servidor",
    "nuvem", "base de dados", "API", "frontend", "backend", "fullstack", "framework", "biblioteca", "pacote", "terminal",
    "linha de comandos", "compilador", "editor", "IDE", "git", "repositório", "branch", "merge", "pull request", "deploy",
    "domínio", "DNS", "HTTP", "HTTPS", "cookies", "cache", "latência", "largura de banda", "algoritmo", "inteligência artificial",
    "aprendizagem automática", "modelo", "treino", "token", "criptografia", "senha", "autenticação", "autorização", "firewall", "VPN"
  ],
  Personalizada: []
} as const


export type WordCategory = keyof typeof WORD_CATEGORIES
