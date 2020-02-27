import React from 'react'
import {
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
// or you can us `import { gql } from 'apollo-boost'` instead;

import Card from '../components/Card'
import { NotificationIcon } from '../components/Icons'
import Logo from '../components/Logo'
import Course from '../components/Course'
import Menu from '../components/Menu'
import Avatar from '../components/Avatar'
import Login from '../components/Login'

// import { Ionicons } from '@expo/vector-icons';

const CardQuery = gql`
  {
    cardsCollection {
      items {
        title
        subtitle
        image {
          title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
        subtitle
        caption
        logo {
          title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
        content
      }
    }
  }
`

function mapStateToProps(state) {
  return {
    action: state.action,
    name: state.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () =>
      dispatch({
        type: 'OPEN_MENU'
      }),
    openLogin: () =>
      dispatch({
        type: 'OPEN_LOGIN'
      })
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  }

  state = {
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1)
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content', true)
    } else if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true)
    }
  }

  componentDidUpdate() {
    this.toggleMenu()
  }

  toggleMenu = () => {
    if (this.props.action === 'openMenu') {
      Animated.timing(this.state.scale, {
        toValue: 0.9,
        duration: 300,
        easing: Easing.in()
      }).start()
      Animated.spring(this.state.opacity, {
        toValue: 0.5
      }).start()

      StatusBar.setBarStyle('light-content', true)
    } else if (this.props.action === 'closeMenu') {
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 300,
        easing: Easing.in()
      }).start()
      Animated.spring(this.state.opacity, {
        toValue: 1
      }).start()
      StatusBar.setBarStyle('dark-content', true)
    }
  }

  handleAvatar = () => {
    if (this.props.name !== 'Unknown') {
      this.props.openMenu()
    } else {
      this.props.openLogin()
    }
  }

  render() {
    return (
      <RootView>
        <Menu />
        <AnimatedContainer
          style={{
            transform: [{ scale: this.state.scale }],
            opacity: this.state.opacity
          }}
        >
          <SafeAreaView>
            <ScrollView style={{ height: '100%' }}>
              <TitleBar>
                <TouchableOpacity
                  style={{ position: 'absolute', top: 0, left: 20 }}
                  onPress={this.handleAvatar}
                >
                  <Avatar />
                </TouchableOpacity>
                <Title>Welcome back,</Title>
                <Name>{this.props.name}</Name>
                <NotificationIcon
                  style={{ position: 'absolute', top: 5, right: 20 }}
                />
              </TitleBar>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  flexDirection: 'row',
                  padding: 20,
                  paddingLeft: 12,
                  paddingTop: 30
                }}
              >
                {logos.map((logo, index) => (
                  <Logo key={index} image={logo.image} text={logo.text} />
                ))}
              </ScrollView>

              <SubTitle>{'Continue Learning'.toUpperCase()}</SubTitle>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: 30 }}
              >
                <Query query={CardQuery}>
                  {({ loading, error, data }) => {
                    if (loading) return <Message>Loading...</Message>
                    if (error) return <Message>Error...</Message>

                    return (
                      <CardsContainer>
                        {data.cardsCollection.items.map((card, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              this.props.navigation.push('Section', {
                                section: card
                              })
                            }
                          >
                            <Card
                              title={card.title}
                              image={{ uri: card.image.url }}
                              caption={card.caption}
                              logo={{ uri: card.logo.url }}
                              subtitle={card.subtitle}
                              content={card.content}
                            />
                          </TouchableOpacity>
                        ))}
                      </CardsContainer>
                    )
                  }}
                </Query>
              </ScrollView>

              <SubTitle>{'Popular Courses'.toUpperCase()}</SubTitle>
              <CoursesContainer>
                {courses.map((course, index) => (
                  <Course
                    key={index}
                    image={course.image}
                    title={course.title}
                    subTitle={course.subtitle}
                    author={course.author}
                    avatar={course.avatar}
                    logo={course.logo}
                    caption={course.caption}
                  />
                ))}
              </CoursesContainer>
            </ScrollView>
          </SafeAreaView>
        </AnimatedContainer>
        <Login />
      </RootView>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const RootView = styled.View`
  background-color: black;
  flex: 1;
`

const CoursesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 10px;
`

const Message = styled.Text`
  margin: 20px;
  color: #b8bece;
  font-size: 15px;
  font-weight: 500;
`

const CardsContainer = styled.View`
  flex-direction: row;
  padding-left: 10px;
`

const SubTitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`

const Container = styled.View`
  flex: 1;
  background-color: #f0f3f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const AnimatedContainer = Animated.createAnimatedComponent(Container)

const Title = styled.Text`
  font-size: 16px;
  color: #b8bece;
  font-weight: 500;
`

const Name = styled.Text`
  font-size: 20px;
  color: #3c4560;
  font-weight: bold;
`

const TitleBar = styled.View`
  width: 100%;
  margin-top: 50px;
  padding-left: 80px;
`

const logos = [
  { image: require('../assets/logo-framerx.png'), text: 'Framer X' },
  { image: require('../assets/logo-figma.png'), text: 'Figma' },
  { image: require('../assets/logo-studio.png'), text: 'Studio' },
  { image: require('../assets/logo-react.png'), text: 'React' },
  { image: require('../assets/logo-swift.png'), text: 'Swift' },
  { image: require('../assets/logo-sketch.png'), text: 'Sketch' }
]

const cards = [
  {
    title: 'React Native for Designers',
    image: require('../assets/background11.jpg'),
    subtitle: 'React Native',
    caption: '1 of 12 sections',
    logo: require('../assets/logo-react.png')
  },
  {
    title: 'Styled Components',
    image: require('../assets/background12.jpg'),
    subtitle: 'React Native',
    caption: '2 of 12 sections',
    logo: require('../assets/logo-react.png')
  },
  {
    title: 'Props and Icons',
    image: require('../assets/background13.jpg'),
    subtitle: 'React Native',
    caption: '3 of 12 sections',
    logo: require('../assets/logo-react.png')
  },
  {
    title: 'Static Data and Loop',
    image: require('../assets/background14.jpg'),
    subtitle: 'React Native',
    caption: '4 of 12 sections',
    logo: require('../assets/logo-react.png')
  }
]

const courses = [
  {
    title: 'Prototype in InVision Studio',
    subtitle: '10 sections',
    image: require('../assets/background13.jpg'),
    logo: require('../assets/logo-studio.png'),
    avatar: require('../assets/avatar.jpg'),
    caption: 'Design and Interactive Prototype',
    author: 'Forgna'
  },
  {
    title: 'React for Designers',
    subtitle: '12 sections',
    image: require('../assets/background11.jpg'),
    logo: require('../assets/logo-react.png'),
    avatar: require('../assets/avatar.jpg'),
    caption: 'Learn to Design and Code a React site',
    author: 'Forgna'
  },
  {
    title: 'Design and Code with Framer X',
    subtitle: '10 sections',
    image: require('../assets/background14.jpg'),
    logo: require('../assets/logo-framerx.png'),
    avatar: require('../assets/avatar.jpg'),
    caption: 'Create powerful design and code components for your app',
    author: 'Forgna'
  },
  {
    title: 'Design System with Figma',
    subtitle: '10 sections',
    image: require('../assets/background6.jpg'),
    logo: require('../assets/logo-figma.png'),
    avatar: require('../assets/avatar.jpg'),
    caption:
      'Complete guid to designing a site using a collaborative design tool',
    author: 'Forgna'
  }
]
