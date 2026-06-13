import { FOOD_DB, CATEGORIES } from "../data/foodData";

export default function FoodsTab({ onSelect }) {
  return (
    <div className="fade-up space-y-4">
      <div>
        <h2 className="text-white font-black text-xl">
          🍽️ Food Library
        </h2>

        <p className="text-slate-500 text-sm mt-1">
          Tap Log to add directly to today
        </p>
      </div>

      {CATEGORIES.map((cat) => (
        <div
          key={cat}
          className="bg-slate-800 border border-slate-600 rounded-2xl p-4"
        >
          <div className="text-indigo-400 text-xs font-black uppercase tracking-wider mb-3">
            {cat}
          </div>

          {FOOD_DB.filter((food) => food.category === cat).map((food) => (
            <div
              key={food.name}
              className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
            >
              <div>
                <div className="text-white text-sm font-medium">
                  {food.emoji} {food.name}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-green-400 font-bold text-sm">
                    {food.servingCalories || food.calories} kcal
                  </div>

                  <div className="text-[10px] sm:text-xs text-slate-400">
                    P:{food.protein}g • C:{food.carbs}g • F:{food.fat}g
                  </div>

                  <div className="text-[10px] text-slate-500">
                    {food.servingSize
                      ? food.servingSize
                      : "per 100g"}
                  </div>
                </div>

                <button
                  onClick={() => onSelect(food)}
                  className="
                    px-3 py-1.5
                    bg-indigo-500/15
                    border border-indigo-500/25
                    rounded-lg
                    text-indigo-400
                    text-xs
                    font-bold
                    hover:bg-indigo-500/25
                    transition-colors
                  "
                >
                  Log
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}