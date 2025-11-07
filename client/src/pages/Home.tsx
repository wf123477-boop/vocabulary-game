import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Volume2, Image as ImageIcon, BookOpen, Zap } from "lucide-react";
import { APP_TITLE } from "@/const";

interface VocabularyItem {
  word: string;
  chinese: string;
  pronunciation: string;
  example: string;
  image: string;
}

type GameMode = "menu" | "listening" | "sentence" | "image" | "fillblank";

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>("menu");
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        // Determine the correct base path
        const currentPath = window.location.pathname;
        const basePath = currentPath.includes('/vocabulary-game') ? '/vocabulary-game' : '';
        const url = `${basePath}/vocabulary-images.json`;
        
        console.log('Current pathname:', currentPath);
        console.log('Base path:', basePath);
        console.log('Fetching from:', url);
        
        const res = await fetch(url);
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Vocabulary loaded successfully:', data.length, 'items');
        setVocabulary(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load vocabulary:", err);
        if (err instanceof Error) {
          console.error("Error message:", err.message);
        }
        setLoading(false);
      }
    };
    
    loadVocabulary();
  }, []);

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer("");
    setFeedback("");
    setShowFeedback(false);
  };

  const handleAnswer = (answer: string) => {
    const current = vocabulary[currentIndex];
    const isCorrect = answer.toLowerCase().trim() === current.word.toLowerCase();
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback("✓ 正確！");
    } else {
      setFeedback(`✗ 錯誤。正確答案是: ${current.word}`);
    }
    
    setShowFeedback(true);
    setUserAnswer("");
    
    setTimeout(() => {
      if (currentIndex < vocabulary.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowFeedback(false);
      } else {
        // Game finished
      }
    }, 1500);
  };

  const playAudio = async (word: string) => {
    try {
      setIsPlaying(true);
      console.log("Starting audio playback for:", word);
      
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';
      
      // Set up event handlers
      utterance.onstart = () => {
        console.log("Audio playback started");
      };
      
      utterance.onend = () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setFeedback(`音頻播放失敗: ${event.error}。請確保您的瀏覽器支援語音合成。`);
        setShowFeedback(true);
        setIsPlaying(false);
      };
      
      // Speak
      const result = window.speechSynthesis.speak(utterance);
      console.log('Speech synthesis initiated:', result);
      
      // Set a timeout to reset playing state if nothing happens
      setTimeout(() => {
        if (isPlaying) {
          console.log('Audio playback timeout');
          setIsPlaying(false);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Error in playAudio:', error);
      setFeedback('音頻播放失敗，請重試');
      setShowFeedback(true);
      setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (gameMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{APP_TITLE}</h1>
            <p className="text-lg text-gray-600">選擇一個遊戲模式開始學習</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                resetGame();
                setGameMode("listening");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-6 h-6 text-blue-600" />
                  聽力猜單字
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  聽取單字發音，然後拼寫出正確的單字
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                resetGame();
                setGameMode("sentence");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  例句猜單字
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  根據例句上下文，填入正確的單字
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                resetGame();
                setGameMode("image");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                  圖形猜單字
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  看圖片，猜出對應的英文單字
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                resetGame();
                setGameMode("fillblank");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-orange-600" />
                  克漏字遊戲
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  填入缺少的字母，完成單字
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentIndex >= vocabulary.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">遊戲完成！</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-indigo-600 mb-4">{score}/{vocabulary.length}</p>
            <p className="text-gray-600 mb-6">你的得分</p>
            <Button 
              onClick={() => setGameMode("menu")}
              className="w-full"
            >
              返回菜單
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const current = vocabulary[currentIndex];
  const currentPath = window.location.pathname;
  const basePath = currentPath.includes('/vocabulary-game') ? '/vocabulary-game' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline"
            onClick={() => setGameMode("menu")}
          >
            返回菜單
          </Button>
          <div className="text-lg font-semibold text-gray-700">
            {currentIndex + 1}/{vocabulary.length} | 分數: {score}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {gameMode === "listening" && "聽力猜單字"}
              {gameMode === "sentence" && "例句猜單字"}
              {gameMode === "image" && "圖形猜單字"}
              {gameMode === "fillblank" && "克漏字遊戲"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameMode === "listening" && (
              <div className="space-y-6">
                <p className="text-gray-600">點擊下方按鈕聽取單字發音</p>
                <Button 
                  onClick={() => playAudio(current.word)}
                  disabled={isPlaying}
                  className="w-full h-16 text-lg"
                >
                  <Volume2 className="mr-2" /> 
                  {isPlaying ? "播放中..." : "播放發音"}
                </Button>
                <div>
                  <label className="block text-sm font-medium mb-2">輸入你聽到的單字:</label>
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAnswer(userAnswer)}
                    placeholder="輸入單字"
                    className="mb-4"
                  />
                  <Button 
                    onClick={() => handleAnswer(userAnswer)}
                    className="w-full"
                  >
                    提交答案
                  </Button>
                </div>
              </div>
            )}

            {gameMode === "sentence" && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {current.example.replace("**" + current.word + "**", "_______")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">填入正確的單字:</label>
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAnswer(userAnswer)}
                    placeholder="輸入單字"
                    className="mb-4"
                  />
                  <Button 
                    onClick={() => handleAnswer(userAnswer)}
                    className="w-full"
                  >
                    提交答案
                  </Button>
                </div>
              </div>
            )}

            {gameMode === "image" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <img 
                    src={`${basePath}${current.image}`}
                    alt="vocabulary" 
                    className="max-w-sm max-h-64 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">這是什麼單字?</label>
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAnswer(userAnswer)}
                    placeholder="輸入單字"
                    className="mb-4"
                  />
                  <Button 
                    onClick={() => handleAnswer(userAnswer)}
                    className="w-full"
                  >
                    提交答案
                  </Button>
                </div>
              </div>
            )}

            {gameMode === "fillblank" && (
              <div className="space-y-6">
                <p className="text-gray-600">填入缺少的字母完成單字</p>
                <div className="text-center">
                  <p className="text-4xl font-bold tracking-widest text-blue-600 mb-4">
                    {current.word
                      .split("")
                      .map((char, idx) => (idx % 2 === 0 ? char : "_"))
                      .join("")}
                  </p>
                  <p className="text-gray-600 mb-4">中文: {current.chinese}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">完整的單字:</label>
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAnswer(userAnswer)}
                    placeholder="輸入完整單字"
                    className="mb-4"
                  />
                  <Button 
                    onClick={() => handleAnswer(userAnswer)}
                    className="w-full"
                  >
                    提交答案
                  </Button>
                </div>
              </div>
            )}

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg text-center text-lg font-semibold ${
                feedback.includes("正確") 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {feedback}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
