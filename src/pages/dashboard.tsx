import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SideBar } from "../components/SideBar";
import { withSSRAuth } from "../utils/withSSRAuth";
import { setupAPIClient } from "../services/api";
import { Chart } from "../components/Chart";

export default function Dashboard() {
    return (
        <Flex direction="column" h="100vh">
            <Header />
            <Flex
                w="100%"
                my="6"
                maxW={1480}
                mx="auto"
                px={["4", "6"]}
            >
                <SideBar />
                <Chart />
            </Flex>
            <Footer />
        </Flex>
    )
}

export const getServerSideProps = withSSRAuth(async ctx => {
    // const apiClient = setupAPIClient(ctx);
    // const response = await apiClient.get('/me');
    // console.log(response.data);

    return {
        props: {}
    }
})