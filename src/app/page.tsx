"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Recipe {
  title: string;
  image: string;
  time: number;
  description: string;
  vegan: boolean;
  id: string;
}

async function fetchRecipe(): Promise<Recipe[]> {
  const result = await fetch("http://localhost:3001/recipes");
  if (!result.ok) {
    throw new Error("Failed to fetch recipes");
  }
  return result.json();
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<string>(""); // State for search query
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchRecipe();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredRecipes(
      recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, recipes]);

  if (loading) {
    return <p className="text-center my-10">Loading recipes...</p>;
  }

  return (
    <main>
      <div className="text-5xl my-5 text-center">Recipe App</div>
      <div className="max-w-xl mx-auto mb-5">
        <Input
          type="text"
          placeholder="Search for a recipe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-5 sm:mx-10 lg:mx-60 my-10 gap-8">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="flex flex-col justify-between">
            <CardHeader className="flex-row gap-4 items-center">
              <Avatar>
                <AvatarImage
                  src={`/img/${recipe.image}`}
                  className="h-5 w-5 sm:h-25 sm:w-25 md:h-25 md:w-25 lg:h-60 lg:w-72 rounded-3xl mx-auto"
                />
                <AvatarFallback>{recipe.title.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{recipe.title}</CardTitle>
                <CardDescription>
                  {recipe.time} mins to prepare.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{recipe.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button>View Recipe</Button>
              {recipe.vegan && <Badge variant="default">Vegan!</Badge>}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
