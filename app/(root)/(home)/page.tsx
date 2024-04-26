import Homefilters from "@/components/home/Homefilters";
import QuestionCard from "@/components/shared/Cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: '1',
    title: 'How to use arrays in JavaScript?',
    author: { _id: '1', name: 'Alice', img: 'alice.jpg' },
    createdAt: new Date('2024-04-26'),
    upvotes: 10,
    views: 1232323,
    tags: [{ _id: '1', name: 'JavaScript' }, { _id: '2', name: 'Array' }],
    answers: [],
  },
  {
    _id: '2',
    title: 'What is the best state management solution for React?',
    author: { _id: '2', name: 'Bob', img: 'bob.jpg' },
    createdAt: new Date('2024-04-25'),
    upvotes: 5,
    views: 50,
    tags: [{ _id: '3', name: 'React' }, { _id: '4', name: 'State Management' }],
    answers: [],
  },
];


const Home = () => {
  return (
    <>
      <div className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4">
        <h1 className="text-dark100_light900 h1-bold">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch 
        route='/'
        iconposition='left'
        imgSrc='/assets/icons/search.svg'
        placeholder="Search for Questions"
        otherClasses='flex-1'
        />
        <Filters
        filters={HomePageFilters}
        otherClasses='min-h-[56px] sm:min-w-[170px]'
        containerClasses='max-md:flex hidden'
        />
      </div>
        <Homefilters/>
        <div className="mt-10 flex flex-col w-full gap-6">
    {
      questions.length>0 ?
      questions.map((item)=>(
        <QuestionCard
        key={item._id}
        _id={item._id}
        title={item.title}
        tags={item.tags}
        author={item.author}
        answers={item.answers}
        upvotes={item.upvotes}
        createdAt={item.createdAt}
        views={item.views}
        />
      ))
      :
      <NoResult
      title='There are no questions To show'
      description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, rerum maxime. Consectetur veritatis magni placeat aliquid iste nesciunt quaerat accusamus officia eos molestiae.'
      link='/ask-question'
      linkTitle='Ask a Question'
      />
    }
        </div>
    </>
  );
};

export default Home;
